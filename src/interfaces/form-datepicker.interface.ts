import type { TTranslatable } from "./translatable.interface";
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormDatePicker {
  type: "datepicker";
  name: string;
  label: TTranslatable;
  placeholder?: TTranslatable;
  tooltip?: TTranslatable;
  minDate?: string;
  maxDate?: string;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition;
  todo?: string;
  businessRules?: IBusinessRule[];
  elementDescription?: string;
  space?: 1 | 2 | 3 | 4;
}
