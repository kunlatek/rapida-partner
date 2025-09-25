import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormAutocomplete {
  type: "autocomplete";
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
  validators?: ("cpf" | "cnpj")[];
  todo?: string;
  optionsApi?: IOptionsApi;
  optionsApiWithConditions?: IOptionsApi[];
  isMultiple?: boolean;
  businessRules?: IBusinessRule[];
}

export interface IOptionsApi {
  endpoint: string;
  labelField: string[];
  valueField: string;
  paramsToFilter: string[];
  paramType: "query" | "path";
  relatedEntity: string;
  populate?: string[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  isNotKunlatekResponse?: boolean;
  rawQuery?: string;
  conditions?: IFormCondition[];
}

export interface IApiResponseField {
  formFieldName: string;
  propertiesFromApiToFillFormField: string[];
  arrayParents?: string[];
}

export interface IApiResponseFieldFilter {
  formFieldName: string;
  filterPropertyName: string;
  conditions?: IFormCondition[];
}
