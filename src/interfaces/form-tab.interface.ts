import type { IFormCondition } from "./condition.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormTab {
  type: "tab";
  todo?: string;
  id: string;
  tabs: {
    id: string;
    title: string;
    elements: IFormElement[];
    conditions?: IFormCondition[];
  }[];
  conditions?: IFormCondition[];
  businessRules?: IBusinessRule[];
}