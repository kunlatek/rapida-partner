import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IContractRequest, IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IList {
  componentType: "list";
  id: string; // named according to component file name (<id>.<componentType>.ts)
  title: string;
  userStory?: string;
  guards?: string[];
  dataSource: IApiRequest;
  businessRules?: IBusinessRule[];
  isListItemSelectable?: boolean;
  listItems: {
    property?: string; // property taken from dataSource response. e.g.: "email"
    label?: string; // label to property. e.g.: "E-mail"
    type?:
    | "title"
    | "subtitle"
    | "description"
    | "video"
    | "image"
    | "images"
    | "icon"
    | "badge";
    isHtml?: boolean;
    isLink?: boolean;
    isTimestamp?: boolean;
    callToAction?: {
      link: string; // e.g.: "/user"
      usePropertyAsQuery?: boolean; // if true then "/user/<email>"
    };
    dataType: EDataType;
    isMultiple?: boolean;
    isExpansible?: boolean;
    conditions?: IFormCondition;
    businessRules?: IBusinessRule[];
    todo?: string;
  }[]; // properties taken from dataSource
  listFilters?: IFormElement[]; // filters to be applied on dataSource
  listActions?: IFormElement[]; // actions that can be performed on the list
  cardAsALink?: {
    link: string; // e.g.: "/user"
    propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
    propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
  };
  callsToActionMenu?: {
    icon: string; // Material icons e.g: "pencil"
    label: string; // e.g: "Editar"
    action: {
      link: {
        // frontend url to be redirected on action completition
        endpoint: string; // e.g.: "/user"
        propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
        propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
      };
      request?: {
        // backend request endpoint that must be processed before link redirection
        endpoint: string; // e.g.: "/user"
        propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
        propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
        verb: "get" | "post" | "put" | "softDelete" | "hardDelete";
        dialog?: {
          title: string;
          message: string;
        };
      };
    };
    businessRules?: IBusinessRule[];
    conditions?: IFormCondition;
    todo?: string;
  }[];
  contracts: {
    id: string;
    endpoint: string;
    actions: (
      | "create"
      | "get"
      | "getById"
      | "update"
      | "softDelete"
      | "hardDelete"
      | "clone"
      | "sendEmail"
    )[];
    request?: IContractRequest;
    conditions?: IFormCondition;
    businessRules?: IBusinessRule[];
    userStory?: string;
  }[];
  publicContracts: {
    id: string;
    endpoint: string;
    actions: ("create" | "get" | "getById" | "update" | "softDelete" | "hardDelete" | "clone" | "sendEmail")[];
    permissionedUrls: string[];
    request?: IContractRequest;
    conditions?: IFormCondition;
    businessRules?: IBusinessRule[];
    userStory?: string;
  }[];
}
