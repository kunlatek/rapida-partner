import type { IFormCondition } from "./form-condition.interface";
import type { IOptionsApi } from "./form-autocomplete.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormSelect {
  type: "select";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file"
    | "char"
    | "nchar"
    | "varchar"
    | "varchar2"
    | "nvarchar"
    | "longtext"
    | "clob"
    | "nclob"
    | "decimal"
    | "numeric"
    | "integer"
    | "float"
    | "double"
    | "real"
    | "timestamp"
    | "datetime"
    | "datetime2"
    | "uniqueidentifier"
    | "boolean";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  conditions?: IFormCondition[];
  validators?: ("cpf" | "cnpj")[];
  todo?: string;
  isMultiple?: boolean;
  options?: ISelectOption[];
  optionsApi?: IOptionsApi;
  businessRules?: IBusinessRule[];
}

interface ISelectOption {
  label: string;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}
