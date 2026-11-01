import type { TTranslatable } from "./translatable.interface";
// MODIFICATION BASED ON: src/interfaces/form-radio.interface.ts
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormRadio {
  type: "radio";
  name: string;
  label: TTranslatable;
  options: IRadioOption[];
  tooltip?: TTranslatable;
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

export interface IRadioOption {
  label: TTranslatable;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}
