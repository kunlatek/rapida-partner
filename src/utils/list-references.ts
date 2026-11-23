import type { IList } from "../interfaces/list.interface";
import type { IComponent, IModule, IProject } from "../interfaces/project.interface";
import { allFields, NUMERIC_DATA_TYPES, type IFlatElement } from "./form-elements";

interface IModuleFields {
  names: Set<string>;
  fields: Map<string, IFlatElement>;
}

const namesOf = (elements: unknown[] | undefined): Set<string> =>
  new Set(allFields(elements).flatMap((field: IFlatElement): string[] => (field.name ? [field.name] : [])));

const isList = (component: IComponent): component is IList => component.componentType === "list";

const moduleFieldsOf = (module: IModule): IModuleFields => {
  const fields: IFlatElement[] = module.components.flatMap((component: IComponent): IFlatElement[] =>
    component.componentType === "form" ? allFields(component.elements) : [],
  );
  const named: [string, IFlatElement][] = fields.flatMap((field: IFlatElement): [string, IFlatElement][] =>
    field.name ? [[field.name, field]] : [],
  );
  return { names: new Set(named.map(([name]) => name)), fields: new Map(named) };
};

const columnViewWarnings = (list: IList): string[] => {
  const properties = new Set(list.listItems.map((item) => item.property).filter(Boolean));
  return (list.columnViews ?? []).flatMap((view) =>
    view.columns
      .filter((column: string) => !properties.has(column))
      .map((column: string) => list.id + ": columnViews cita a coluna \"" + column + "\", que não está em listItems"),
  );
};

const columnGroupWarnings = (list: IList): string[] => {
  const groups: string[] = list.listItems.filter((item) => item.columnGroup).map((item) => JSON.stringify(item.columnGroup));
  const seen: string[] = [];
  const warnings: string[] = [];
  groups.forEach((group: string, index: number) => {
    if (index > 0 && group !== groups[index - 1] && seen.includes(group)) {
      warnings.push(list.id + ": o columnGroup " + group + " aparece separado; deixe as colunas do mesmo grupo juntas");
    }
    if (!seen.includes(group)) seen.push(group);
  });
  return warnings;
};

const kpiWarnings = (list: IList, fields: Map<string, IFlatElement>): string[] => {
  const kpis = list.kpis ?? [];
  const warnings: string[] = [];
  if (kpis.filter((kpi) => kpi.tone === "brand").length > 1) {
    warnings.push(list.id + ": mais de um KPI com tone \"brand\"; use no máximo um");
  }
  for (const kpi of kpis) {
    if (kpi.sumOf) {
      const field = fields.get(kpi.sumOf);
      if (!field) warnings.push(list.id + ": kpis.sumOf \"" + kpi.sumOf + "\" não existe em nenhum form do módulo");
      else if (!NUMERIC_DATA_TYPES.includes((field.dataType ?? "").toLowerCase())) {
        warnings.push(list.id + ": kpis.sumOf \"" + kpi.sumOf + "\" não é um campo numérico");
      }
    }
    for (const condition of Array.isArray(kpi.filter) ? kpi.filter : []) {
      if (!fields.has(condition.field)) {
        warnings.push(list.id + ": kpis.filter cita o campo \"" + condition.field + "\", que não existe em nenhum form do módulo");
      }
    }
  }
  return warnings;
};

const listWarnings = (list: IList, moduleFields: IModuleFields): string[] => {
  const warnings: string[] = [];
  const filterNames: Set<string> = namesOf(list.listFilters);
  for (const name of list.quickFilters ?? []) {
    if (!filterNames.has(name)) {
      warnings.push(list.id + ": quickFilters cita \"" + name + "\", que não está em listFilters");
    }
  }
  const tabs = list.tabs;
  if (tabs && !tabs.options?.length && !moduleFields.names.has(tabs.property)) {
    warnings.push(
      list.id + ": tabs.property \"" + tabs.property + "\" não existe em nenhum form do módulo e tabs.options está vazio",
    );
  }
  return [...warnings, ...columnViewWarnings(list), ...columnGroupWarnings(list), ...kpiWarnings(list, moduleFields.fields)];
};

// Nomes citados por texto (quickFilters, tabs.property, columnViews, kpis) que o schema não consegue conferir.
export const checkListReferences = (project: IProject): string[] =>
  (project.modules ?? []).flatMap((module: IModule): string[] => {
    const lists: IList[] = module.components.filter(isList);
    if (lists.length === 0) return [];
    const moduleFields: IModuleFields = moduleFieldsOf(module);
    return lists.flatMap((list: IList) => listWarnings(list, moduleFields));
  });
