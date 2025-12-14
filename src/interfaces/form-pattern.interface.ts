import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormPatternInput {
  type: "pattern";
  name: string;
  label: string;
  format: string;
  placeholder?: string;
  tooltip?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition;
  todo?: string;
  businessRules?: IBusinessRule[];
}
