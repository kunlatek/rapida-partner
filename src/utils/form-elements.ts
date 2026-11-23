export interface IFlatElement {
  name?: string;
  type?: string;
  dataType?: string;
  range?: boolean;
  recordTimestamp?: boolean;
}

interface INode extends IFlatElement {
  elements?: unknown[];
  tabs?: { elements?: unknown[] }[];
}

// Achata tabs e fieldsets; arrays entram com o próprio nome, mas não os campos de dentro.
export const flattenElements = (elements: unknown[] | undefined): IFlatElement[] =>
  (elements ?? []).flatMap((element: unknown): IFlatElement[] => {
    const node = (element ?? {}) as INode;
    if (node.type === "tab") return flattenElements((node.tabs ?? []).flatMap((tab) => tab.elements ?? []));
    if (node.type === "fieldset") return flattenElements(node.elements);
    return [node];
  });

export const NUMERIC_DATA_TYPES: string[] = ["number", "integer", "decimal", "float", "currency", "money"];
