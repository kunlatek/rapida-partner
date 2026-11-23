import type { IList } from "../interfaces/list.interface";
import type { IComponent, IModule, IProject } from "../interfaces/project.interface";
import { formEntitiesOf, type IFormEntity } from "./entities";
import { allFields, type IFlatElement } from "./form-elements";
import { kpiFieldsOf, kpiWarnings } from "./list-kpi-references";

const NO_GROUP: string = "<sem grupo>";

const namesOf = (elements: unknown[] | undefined): Set<string> =>
  new Set(allFields(elements).flatMap((field: IFlatElement): string[] => (field.name ? [field.name] : [])));

const isList = (component: IComponent): component is IList => component.componentType === "list";

const isForm = (component: IComponent): boolean => component.componentType === "form";

const columnViewWarnings = (list: IList): string[] => {
  const properties = new Set(list.listItems.map((item) => item.property).filter(Boolean));
  return (list.columnViews ?? []).flatMap((view) =>
    view.columns
      .filter((column: string) => !properties.has(column))
      .map((column: string) => list.id + ": columnViews cita a coluna \"" + column + "\", que não está em listItems"),
  );
};

// Compara cada coluna com a anterior, contando "sem grupo" como um grupo, para pegar também um grupo
// interrompido por uma coluna sem columnGroup.
const columnGroupWarnings = (list: IList): string[] => {
  if (!list.listItems.some((item) => item.columnGroup)) return [];
  const groups: string[] = list.listItems.map((item) => (item.columnGroup ? JSON.stringify(item.columnGroup) : NO_GROUP));
  const closed = new Set<string>();
  const warnings: string[] = [];
  groups.forEach((group: string, index: number) => {
    const previous: string | undefined = groups[index - 1];
    if (previous !== undefined && previous !== group) closed.add(previous);
    if (group !== NO_GROUP && group !== previous && closed.has(group)) {
      warnings.push(list.id + ": o columnGroup " + group + " aparece separado; deixe as colunas do mesmo grupo juntas");
    }
  });
  return warnings;
};

const listWarnings = (list: IList, module: IModule, entities: IFormEntity[]): string[] => {
  const warnings: string[] = [];
  const moduleForms: IComponent[] = module.components.filter(isForm);
  const filterNames: Set<string> = namesOf(list.listFilters);
  for (const name of list.quickFilters ?? []) {
    if (!filterNames.has(name)) warnings.push(list.id + ": quickFilters cita \"" + name + "\", que não está em listFilters");
  }
  const tabs = list.tabs;
  const moduleNames = new Set<string>(moduleForms.flatMap((form: IComponent) => [...namesOf("elements" in form ? form.elements : undefined)]));
  if (tabs && !tabs.options?.length && !moduleNames.has(tabs.property)) {
    warnings.push(list.id + ": tabs.property \"" + tabs.property + "\" não existe em nenhum form do módulo e tabs.options está vazio");
  }
  const { fields, source } = kpiFieldsOf(list, entities, moduleForms);
  const kpis: string[] = list.kpis?.length ? kpiWarnings(list, fields, source) : [];
  return [...warnings, ...columnViewWarnings(list), ...columnGroupWarnings(list), ...kpis];
};

// Nomes citados por texto (quickFilters, tabs.property, columnViews, kpis) que o schema não consegue conferir.
export const checkListReferences = (project: IProject): string[] => {
  const entities: IFormEntity[] = formEntitiesOf(project);
  return (project.modules ?? []).flatMap((module: IModule): string[] =>
    module.components.filter(isList).flatMap((list: IList) => listWarnings(list, module, entities)),
  );
};
