import type { EFormContractDataType } from "../enums/form-contract.enum";
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
  contracts: {
    endpoint: string;
    methods: { verb: "GET" | "POST" | "PUT" | "DELETE" }[];
    request?: IApiRequest;
  }[];
  kanban?: {
    status: "toDo" | "inProgress" | "done";
    assigneesIds?: string[];
    validatorsIds?: string[];
    dueDate?: string;
    tags?: string[];
    priority?: "low" | "medium" | "high" | "urgent";
    storyPoints?: number;
  }
}

interface IFormContractGeneral {
  name: string;
  dataType: EFormContractDataType;
}

interface IFormContractArray {
  name: string;
  dataType: "array";
  elements: (IFormContractGeneral | IFormContractArray)[];
}

export interface IApiRequest {
  body?: (IFormContractGeneral | IFormContractArray)[];
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