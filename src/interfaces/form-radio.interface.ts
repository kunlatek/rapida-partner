import type { TTranslatable } from "./translatable.interface";
// MODIFICATION BASED ON: src/interfaces/form-radio.interface.ts
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";
import type { TChoiceDisplay } from "./choice-display.interface";

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
  display?: TChoiceDisplay; // ver choice-display.interface.ts
}

export interface IRadioOption {
  label: TTranslatable;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  // Texto de apoio da opção, mostrado só com display "cards".
  description?: TTranslatable;
}
