import type { IFormCondition } from "./condition.interface";
import type { IForm } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormInheritance {
  type: "inheritance";
  form: IForm;
  conditions?: IFormCondition[];
  todo?: string;
  businessRules?: IBusinessRule[];
}
