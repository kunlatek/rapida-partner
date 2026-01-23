import type { EDataType } from "../enums/form.enum";
import type { IFormArray } from "./form-array.interface";
import type { IFormAutocomplete } from "./form-autocomplete.interface";
import type { IFormButton } from "./form-button.interface";
import type { IFormCondition } from "./condition.interface";
import type { IFormDatePicker } from "./form-datepicker.interface";
import type { IFormFieldset } from "./form-fieldset.interface";
import type { IFormFile } from "./form-file.interface";
import type { IFormInheritance } from "./form-inheritance.interface";
import type { IFormInput } from "./form-input.interface";
import type { IFormSelect } from "./form-select.interface";
import type { IFormTab } from "./form-tab.interface";
import type { IBusinessRule } from "./project.interface";
import type { IFlowChart } from "./form-flowchart.interface";
import type { IContract, IPublicContract } from "./form-contract.interface";

export interface IForm {
  componentType: "form";
  id: string;
  title: string;
  elements: IFormElement[];
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  userStory?: string;
  contracts: IContract[];
  publicContracts?: IPublicContract[];
  flowChart?: IFlowChart;
  sendMessage?: {
    type: "email" | "whatsapp" | "sms" | "discord" | "teams" | "push";
    actions: "create" | "update" | "delete";
    to: {
      field: string;
      property?: string; // if field is a property of a related object else take the value of the field. e.g.: field.property
    };
    subject?: string; // use mustache syntax to insert values. e.g.: {{field}}
    message: string; // use mustache syntax to insert values. e.g.: {{field}}
  }[];
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
  | IFormDatePicker
  | IFormInheritance;