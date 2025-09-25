import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormNumericInput {
  type: "numeric";
  name: string;
  label: string;
  placeholder?: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  thousandSeparator?: boolean;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  conditions?: IFormCondition[];
  todo?: string;
  businessRules?: IBusinessRule[];
}
