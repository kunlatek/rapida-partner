import type { TTranslatable } from "./translatable.interface";
// MODIFICATION BASED ON: src/interfaces/form-checkbox.interface.ts
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormCheckbox {
  type: "checkbox";
  name: string;
  label: TTranslatable;
  options: ICheckboxOption[];
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
  // Como as opções aparecem. "list" (padrão): uma por linha. "chips": botões lado a lado,
  // para opções curtas (dias da semana, durações). "cards": cartões com a description de
  // cada opção, para escolhas que mudam o resto do formulário.
  display?: TChoiceDisplay;
}

export type TChoiceDisplay = "list" | "chips" | "cards";

export interface ICheckboxOption {
  label: TTranslatable;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  // Texto de apoio da opção, mostrado só com display "cards".
  description?: TTranslatable;
}
