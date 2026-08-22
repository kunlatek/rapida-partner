import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type {
  IApiResponseField,
  IApiResponseFieldFilter,
} from "./form-autocomplete.interface";
import type { IBusinessRule } from "./project.interface";
import type { IStorageConfig } from "./form-file.interface";

interface IFormInputBase {
  type: "input";
  name: string;
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
  validators?: ("cep" | "cpf" | "cnpj" | "onlyNumbers" | "phone" | "email")[];
  todo?: string;
  maxLength?: number;
  minLength?: number;
  apiRequest?: IApiRequest;
  businessRules?: IBusinessRule[];
  mask?: string | string[];
  suffix?: string;
  prefix?: string;
  defaultValue?: string | number | boolean;
  elementDescription?: string;
  space?: 1 | 2 | 3 | 4;
}

// dataType: "wysiwyg" sobe imagens embutidas no editor via upload real (não
// base64): storageConfig é obrigatório aqui para o gerador saber path/
// fileNameStrategy/visibility do endpoint de upload inline usado pelo editor.
export interface IFormInputWysiwyg extends IFormInputBase {
  dataType: EDataType.WYSIWYG;
  storageConfig: IStorageConfig;
}

export interface IFormInputOther extends IFormInputBase {
  dataType: Exclude<EDataType, EDataType.WYSIWYG>;
  storageConfig?: undefined;
}

export type IFormInput = IFormInputWysiwyg | IFormInputOther;

export interface IApiRequest {
  endpoint: string;
  paramType: "query" | "path";
  isNotKunlatekResponse?: boolean;
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  hasAuthentication?: boolean;
  conditions?: IFormCondition;
}
