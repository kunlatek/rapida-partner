import type { IList } from "../interfaces/list.interface";
import type { IComponent, IModule, IProject } from "../interfaces/project.interface";

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

const listWarnings = (list: IList, formNames: Set<string>): string[] => {
  const warnings: string[] = [];
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
  return warnings;
};

// Nomes citados por texto (quickFilters e tabs.property) que o schema não consegue conferir.
export const checkListReferences = (project: IProject): string[] =>
  (project.modules ?? []).flatMap((module: IModule): string[] => {
    const formNames = formNamesOf(module);
    return module.components.filter(isList).flatMap((list: IList) => listWarnings(list, formNames));
  });
