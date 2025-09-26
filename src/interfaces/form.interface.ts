import type { EFormContractDataType } from "../enums/form-contract.enum";
import type { EDataType } from "../enums/form.enum";
import type { IFormArray } from "./form-array.interface";
import type { IFormAutocomplete } from "./form-autocomplete.interface";
import type { IFormButton } from "./form-button.interface";
import type { IFormCondition } from "./form-condition.interface";
import type { IFormDatePicker } from "./form-datepicker.interface";
import type { IFormFieldset } from "./form-fieldset.interface";
import type { IFormFile } from "./form-file.interface";
import type { IFormInheritance } from "./form-inheritance.interface";
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
    actions: ("create" | "get" | "getById" | "update" | "delete" | "clone")[];
    request?: IContractRequest;
    conditions?: IFormCondition[];
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

interface IContractRequest {
  entity: string,
  relatedEntity?: string,
  description?: string,
  fields: IContractRequestField[]
}

interface IContractRequestField {
  name: string;
  dataType: EFormContractDataType;
  isRequired?: boolean;
  foreignKey?: IContractRequestFieldForeignKey;
  isPrimaryKey?: boolean;
  minSize?: number;
  maxSize?: number;
  enum?: string[];
  isUnique?: boolean;
  uniqueComposedFields?: string[];
  actionsExceptions?: ("create" | "getOne" | "getAll" | "update" | "delete" | "clone")[];
}

interface IContractRequestFieldForeignKey {
  entity: string;
  connectionAttribute: string;
  relationship: "many-to-many" | "one-to-many" | "one-to-one"
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
  | IFormDatePicker
  | IFormInheritance;