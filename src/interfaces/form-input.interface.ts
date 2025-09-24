import type { EDataType } from "../enums/form.enum";
import type {
  IApiResponseField,
  IApiResponseFieldFilter,
} from "./form-autocomplete.interface";
import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormInput {
  type: "input";
  name: string;
  dataType: EDataType;
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
