import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormDatePicker {
  type: "datepicker";
  name: string;
  label: string;
  placeholder?: string;
  tooltip?: string;
  minDate?: string;
  maxDate?: string;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition[];
  todo?: string;
  businessRules?: IBusinessRule[];
}
