import type { IComponent, IModule, IProject } from "../interfaces/project.interface";
import { fieldScopes, type IFlatElement } from "./form-elements";

const RESERVED_FIELDS: string[] = ["createdAt", "createdBy", "updatedAt", "updatedBy", "deletedAt", "workspaceId"];
const CONSENT_SUFFIXES: string[] = ["At", "By", "RevokedAt", "RevokedBy"];

const scopeWarnings = (id: string, fields: IFlatElement[], isRoot: boolean): string[] => {
  const names = new Set(fields.map((field: IFlatElement) => field.name).filter(Boolean));
  const reserved: string[] = isRoot ? RESERVED_FIELDS : [];
  const warnings: string[] = [];
  for (const field of fields) {
    if (field.type === "datepicker" && field.range === true) {
      warnings.push(id + ": \"" + field.name + "\" tem range, que só vale em listFilters; no form vira uma data simples");
    }
    if (field.type === "switch" && field.recordTimestamp === true && field.name) {
      for (const generated of CONSENT_SUFFIXES.map((suffix: string) => field.name + suffix)) {
        if (reserved.includes(generated) || names.has(generated)) {
          warnings.push(id + ": recordTimestamp em \"" + field.name + "\" gera o campo \"" + generated + "\", que já existe");
        }
      }
    }
  }
  return warnings;
};

const formWarnings = (component: IComponent): string[] =>
  component.componentType === "form"
    ? fieldScopes(component.elements).flatMap((fields: IFlatElement[], index: number) => scopeWarnings(component.id, fields, index === 0))
    : [];

// Regras de formulário que o schema não consegue conferir (range fora de filtro, colisão do recordTimestamp),
// no form e dentro de cada item de array.
export const checkFormReferences = (project: IProject): string[] =>
  (project.modules ?? []).flatMap((module: IModule): string[] => module.components.flatMap(formWarnings));
