import type { IComponent, IModule, IProject } from "../interfaces/project.interface";
import { flattenElements, type IFlatElement } from "./form-elements";

const RESERVED_FIELDS: string[] = ["createdAt", "createdBy", "updatedAt", "updatedBy", "deletedAt", "workspaceId"];
const CONSENT_SUFFIXES: string[] = ["At", "By", "RevokedAt", "RevokedBy"];

const formWarnings = (component: IComponent): string[] => {
  if (component.componentType !== "form") return [];
  const fields: IFlatElement[] = flattenElements(component.elements);
  const names = new Set(fields.map((field: IFlatElement) => field.name).filter(Boolean));
  const warnings: string[] = [];
  for (const field of fields) {
    if (field.type === "datepicker" && field.range === true) {
      warnings.push(component.id + ": \"" + field.name + "\" tem range, que só vale em listFilters; no form vira uma data simples");
    }
    if (field.type === "switch" && field.recordTimestamp === true && field.name) {
      for (const generated of CONSENT_SUFFIXES.map((suffix: string) => field.name + suffix)) {
        if (RESERVED_FIELDS.includes(generated) || names.has(generated)) {
          warnings.push(component.id + ": recordTimestamp em \"" + field.name + "\" gera o campo \"" + generated + "\", que já existe");
        }
      }
    }
  }
  return warnings;
};

// Regras de formulário que o schema não consegue conferir (range fora de filtro, colisão do recordTimestamp).
export const checkFormReferences = (project: IProject): string[] =>
  (project.modules ?? []).flatMap((module: IModule): string[] => module.components.flatMap(formWarnings));
