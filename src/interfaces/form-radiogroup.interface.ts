import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

interface IRadioOption {
  label: string;
  value: string | number | boolean;
}

export interface IFormRadioGroup {
  type: "radiogroup";
  name: string;
  label: string;
  options: IRadioOption[];
  tooltip?: string;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition[];
  todo?: string;
  businessRules?: IBusinessRule[];
}
