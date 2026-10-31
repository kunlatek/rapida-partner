import type { TTranslatable } from "./translatable.interface";
import type { IFormCondition } from "./condition.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormFieldset {
  type: "fieldset";
  conditions?: IFormCondition;
  todo?: string;
  id: string;
  title: TTranslatable;
  elements: IFormElement[];
  businessRules?: IBusinessRule[];
  elementDescription?: string;
}
