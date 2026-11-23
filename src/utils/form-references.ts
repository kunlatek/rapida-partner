import type { IForm } from "../interfaces/form.interface";
import type { IComponent, IModule, IProject } from "../interfaces/project.interface";
import { fieldScopes, type IFlatElement } from "./form-elements";

const RESERVED_FIELDS: string[] = ["createdAt", "createdBy", "updatedAt", "updatedBy", "deletedAt", "workspaceId"];
const CONSENT_SUFFIXES: string[] = ["At", "By", "RevokedAt", "RevokedBy"];

interface IFormToCheck {
  id: string;
  elements: unknown[] | undefined;
  recordsConsent: boolean;
}

// Mesma regra do sanitizeFieldName do gerador: "accepted-terms" vira "accepted_terms".
const backendName = (name: string): string => name.replace(/[^a-zA-Z0-9_]/g, "_");

const consentWarnings = (form: IFormToCheck, fields: IFlatElement[], isRoot: boolean): string[] => {
  const switches: IFlatElement[] = fields.filter((field: IFlatElement) => field.type === "switch" && field.recordTimestamp === true && field.name);
  if (!isRoot) {
    return switches.map((field: IFlatElement) => form.id + ": recordTimestamp em \"" + field.name + "\" está dentro de um array; só vale no nível de cima do form, e o aceite não é registrado");
  }
  if (!form.recordsConsent) {
    return switches.map((field: IFlatElement) => form.id + ": recordTimestamp em \"" + field.name + "\" só vale no primeiro form do módulo; neste o aceite não é registrado");
  }
  const names = new Set(fields.flatMap((field: IFlatElement): string[] => (field.name ? [backendName(field.name)] : [])));
  return switches.flatMap((field: IFlatElement): string[] =>
    CONSENT_SUFFIXES.map((suffix: string) => backendName(field.name ?? "") + suffix)
      .filter((generated: string) => RESERVED_FIELDS.includes(generated) || names.has(generated))
      .map((generated: string) => form.id + ": recordTimestamp em \"" + field.name + "\" gera o campo \"" + generated + "\", que já existe"),
  );
};

const rangeWarnings = (form: IFormToCheck, fields: IFlatElement[]): string[] =>
  fields
    .filter((field: IFlatElement) => field.type === "datepicker" && field.range === true)
    .map((field: IFlatElement) => form.id + ": \"" + field.name + "\" tem range, que só vale em listFilters; no form vira uma data simples");

const formWarnings = (form: IFormToCheck): string[] =>
  fieldScopes(form.elements).flatMap((fields: IFlatElement[], index: number) => [
    ...rangeWarnings(form, fields),
    ...consentWarnings(form, fields, index === 0),
  ]);

// O backend gerado grava o consentimento só no primeiro form de cada módulo; os forms de perfil viram uma
// collection só, então os dois gravam.
const formsOf = (project: IProject): IFormToCheck[] => [
  ...(project.modules ?? []).flatMap((module: IModule): IFormToCheck[] =>
    module.components
      .filter((component: IComponent) => component.componentType === "form")
      .map((component: IComponent, index: number) => ({ id: component.id, elements: "elements" in component ? component.elements : undefined, recordsConsent: index === 0 })),
  ),
  ...[project.flows?.profiles?.personProfile, project.flows?.profiles?.companyProfile]
    .filter((form: IForm | undefined): form is IForm => !!form)
    .map((form: IForm) => ({ id: form.id, elements: form.elements, recordsConsent: true })),
];

// Regras de formulário que o schema não consegue conferir (range fora de filtro e recordTimestamp:
// lugar onde o gerador grava e colisão com campos existentes).
export const checkFormReferences = (project: IProject): string[] => formsOf(project).flatMap(formWarnings);
