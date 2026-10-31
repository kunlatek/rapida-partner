import type { TTranslatable } from "./translatable.interface";
import type { IFormCondition } from "./condition.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormArray {
  type: "array";
  name: string;
  label: TTranslatable;
  elements: IFormElement[];
  tooltip?: TTranslatable;
  conditions?: IFormCondition;
  todo?: string;
  businessRules?: IBusinessRule[];
  elementDescription?: string;
  isRequired?: boolean;
}
