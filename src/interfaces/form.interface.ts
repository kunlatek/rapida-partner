import type { IFormArray } from "./form-array.interface";
import type { IFormAutocomplete } from "./form-autocomplete.interface";
import type { IFormButton } from "./form-button.interface";
import type { IFormDatePicker } from "./form-datepicker.interface";
import type { IFormFieldset } from "./form-fieldset.interface";
import type { IFormFile } from "./form-file.interface";
import type { IFormInput } from "./form-input.interface";
import type { IFormSelect } from "./form-select.interface";
import type { IFormTab } from "./form-tab.interface";
import type { IBusinessRule } from "./project.interface";

export interface IForm {
  componentType: "form";
  id: string;
  title: string;
  elements: IFormElement[];
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  userStory?: string;
  apiConfig: {
    create: {
      endpoint: string;
      method: "POST";
      contract?: IApiContract;
    }[];
    update?: {
      endpoint: string;
      method: "PUT";
      propertiesAsPathParam: string[];
    };
  };
}

export interface IApiContract {
  request: {
    body: {
      key: string;
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
    }[];
  };
}

export type IFormElement =
  | IFormInput
  | IFormSelect
  | IFormAutocomplete
  | IFormArray
  | IFormTab
  | IFormFieldset
  | IFormButton
  | IFormFile
  | IFormDatePicker;