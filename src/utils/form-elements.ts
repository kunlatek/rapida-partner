import { EDataType } from "../enums/form.enum";

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

const nodeOf = (element: unknown): INode => (element ?? {}) as INode;

const childrenOf = (node: INode): unknown[] =>
  node.type === "tab" ? (node.tabs ?? []).flatMap((tab) => tab.elements ?? []) : (node.elements ?? []);

const isContainer = (node: INode): boolean => node.type === "tab" || node.type === "fieldset";

// Campos de um mesmo nível: entra em tabs e fieldsets; o array conta como um campo, sem os de dentro.
export const flattenElements = (elements: unknown[] | undefined): IFlatElement[] =>
  (elements ?? []).map(nodeOf).flatMap((node: INode): IFlatElement[] => (isContainer(node) ? flattenElements(childrenOf(node)) : [node]));

// Cada nível de campos separado: o form e, depois, o item de cada array (também os aninhados).
export const fieldScopes = (elements: unknown[] | undefined): IFlatElement[][] => {
  const fields: IFlatElement[] = flattenElements(elements);
  const nested: IFlatElement[][] = fields
    .filter((field: IFlatElement) => field.type === "array")
    .flatMap((field: IFlatElement) => fieldScopes(nodeOf(field).elements));
  return [fields, ...nested];
};

// Todos os campos, inclusive os de dentro dos arrays.
export const allFields = (elements: unknown[] | undefined): IFlatElement[] => fieldScopes(elements).flat();

export const NUMERIC_DATA_TYPES: string[] = [
  EDataType.NUMBER,
  EDataType.INTEGER,
  EDataType.DECIMAL,
  EDataType.NUMERIC,
  EDataType.FLOAT,
  EDataType.DOUBLE,
  EDataType.REAL,
  EDataType.CURRENCY,
];
