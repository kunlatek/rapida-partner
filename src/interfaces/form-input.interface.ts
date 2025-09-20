import type {
  IApiResponseField,
  IApiResponseFieldFilter,
} from "./form-autocomplete.interface";
import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormInput {
  type: "input";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "wysiwyg"
    | "time"
    | "file"
    | "array"
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
  validators?: ("cep" | "cpf" | "cnpj" | "onlyNumbers" | "phone" | "email")[];
  todo?: string;
  maxLength?: number;
  minLength?: number;
  apiRequest?: IApiRequest;
  businessRules?: IBusinessRule[];
  maskRegex?: string;
  suffix?: string;
  prefix?: string;
}

export interface IApiRequest {
  endpoint: string;
  paramType: "query" | "path";
  isNotKunlatekResponse?: boolean;
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  hasAuthentication?: boolean;
  conditions?: IFormCondition[];
}
