import type { IList } from "../interfaces/list.interface";
import type { IComponent, IModule, IProject } from "../interfaces/project.interface";
import { flattenElements, NUMERIC_DATA_TYPES, type IFlatElement } from "./form-elements";

interface INamedNode {
  name?: string;
  elements?: unknown[];
  tabs?: { elements?: unknown[] }[];
}

const namesOf = (elements: unknown[] | undefined): string[] =>
  (elements ?? []).flatMap((element: unknown): string[] => {
    const node = (element ?? {}) as INamedNode;
    return [
      ...(node.name ? [node.name] : []),
      ...namesOf(node.elements),
      ...namesOf((node.tabs ?? []).flatMap((tab) => tab.elements ?? [])),
    ];
  });

const isList = (component: IComponent): component is IList => component.componentType === "list";

const formNamesOf = (module: IModule): Set<string> =>
  new Set(
    module.components.flatMap((component: IComponent): string[] =>
      component.componentType === "form" ? namesOf(component.elements) : [],
    ),
  );

const formFieldsOf = (module: IModule): Map<string, IFlatElement> =>
  new Map(
    module.components
      .flatMap((component: IComponent): IFlatElement[] => (component.componentType === "form" ? flattenElements(component.elements) : []))
      .filter((field: IFlatElement): field is IFlatElement & { name: string } => typeof field.name === "string")
      .map((field) => [field.name, field] as [string, IFlatElement]),
  );

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

const listWarnings = (list: IList, module: IModule): string[] => {
  const warnings: string[] = [];
  const formNames = formNamesOf(module);
  const filterNames = new Set(namesOf(list.listFilters));
  for (const name of list.quickFilters ?? []) {
    if (!filterNames.has(name)) {
      warnings.push(list.id + ": quickFilters cita \"" + name + "\", que não está em listFilters");
    }
  }
  const tabs = list.tabs;
  if (tabs && !tabs.options?.length && !formNames.has(tabs.property)) {
    warnings.push(
      list.id + ": tabs.property \"" + tabs.property + "\" não existe em nenhum form do módulo e tabs.options está vazio",
    );
  }
  return [...warnings, ...columnViewWarnings(list), ...columnGroupWarnings(list), ...kpiWarnings(list, formFieldsOf(module))];
};

// Nomes citados por texto (quickFilters, tabs.property, columnViews, kpis) que o schema não consegue conferir.
export const checkListReferences = (project: IProject): string[] =>
  (project.modules ?? []).flatMap((module: IModule): string[] =>
    module.components.filter(isList).flatMap((list: IList) => listWarnings(list, module)),
  );
