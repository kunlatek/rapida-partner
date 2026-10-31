import type { TTranslatable } from "./translatable.interface";
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormNumericInput {
  type: "numeric";
  name: string;
  label: TTranslatable;
  placeholder?: TTranslatable;
  tooltip?: TTranslatable;
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
  conditions?: IFormCondition;
  todo?: string;
  businessRules?: IBusinessRule[];
}
