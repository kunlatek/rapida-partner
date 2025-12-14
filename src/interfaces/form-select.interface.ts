import type { IFormCondition } from "./condition.interface";
import type { IOptionsApi } from "./form-autocomplete.interface";
import type { IBusinessRule } from "./project.interface";
import type { EDataType } from "../enums/form.enum";

export interface IFormSelect {
  type: "select";
  name: string;
  dataType: EDataType;
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  conditions?: IFormCondition;
  validators?: ("cpf" | "cnpj")[];
  todo?: string;
  isMultiple?: boolean;
  options?: ISelectOption[];
  optionsApi?: IOptionsApi;
  businessRules?: IBusinessRule[];
  elementDescription?: string;
}

interface ISelectOption {
  label: string;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}
