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
import type { IActor, IFlowChart } from "./form-flowchart.interface";

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
    id: string;
    endpoint: string;
    actions: ("create" | "get" | "getById" | "update" | "softDelete" | "hardDelete" | "clone" | "sendEmail")[];
    request?: IContractRequest;
    conditions?: IFormCondition[];
    businessRules?: IBusinessRule[];
    userStory?: string;
  }[];
  flowChart?: IFlowChart;
}

export interface IContract {
  id: string;
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

export interface IContractRequest {
  entity: string,
  relatedEntity?: {
    entity: string;
    connectionAttribute: string;
    fieldsFromEntity: {
      fields: IForm;
      contractId: string;
    }[]
  },
  description?: string,
  fields: IContractRequestField[]
  uniqueConstraints?: {
    identificator: string;
    fields: string[];
  }[];
}

export interface IContractRequestField {
  name: string;
  dataType: EDataType;
  requiredOneOf?: string[];
  isRequired?: boolean;
  isHidden?: boolean;
  foreignKey?: IContractRequestFieldForeignKey;
  isPrimaryKey?: boolean;
  minSize?: number;
  maxSize?: number;
  enum?: (string | number)[];
  isUnique?: boolean;
  uniqueComposedFields?: string[];
  defaultValue?: string | number | boolean;
  actionsExceptions?: ("create" | "getOne" | "getAll" | "update" | "softDelete" | "hardDelete" | "clone")[];
  businessRules?: IBusinessRule[];
}

interface IContractRequestFieldForeignKey {
  entity: string;
  connectionAttribute: string;
  relationship: "many-to-many" | "one-to-many" | "one-to-one"
  fields?: IContractRequestField[];
  isHidden?: boolean;
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