import type { IFormCondition } from "./condition.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormArray {
  type: "array";
  name: string;
  title: string;
  elements: IFormElement[];
  conditions?: IFormCondition[];
  todo?: string;
  businessRules?: IBusinessRule[];
}
