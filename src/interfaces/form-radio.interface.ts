import type { TTranslatable } from "./translatable.interface";
// MODIFICATION BASED ON: src/interfaces/form-radio.interface.ts
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";
import type { TChoiceDisplay } from "./form-checkbox.interface";

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
  // Como as opções aparecem; ver TChoiceDisplay em form-checkbox.interface.ts.
  display?: TChoiceDisplay;
}

export interface IRadioOption {
  label: TTranslatable;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  // Texto de apoio da opção, mostrado só com display "cards".
  description?: TTranslatable;
}
