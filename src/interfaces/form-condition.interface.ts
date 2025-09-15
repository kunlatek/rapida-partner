import type { IBusinessRule } from "./project.interface";

export interface IFormCondition {
  type: "form" | "code" | "array";
  elements?: IConditionElement[];
  code?: IConditionCode;
  businessRules?: IBusinessRule[];
  conditionResponse?: "show" | "hide" | "enable" | "disable" | "fillFields";
  fillFields?: { 
    fieldKey: string;
    value: any;
  }[];
}

interface IConditionElement {
  key: string;
  value?: any;
  array?: string;
  comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
  logicalOperator?: "&&" | "!" | "nor" | "||";
}

interface IConditionCode {
  triggerField: string;
  code: string;
}
