import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IFormAutocomplete } from "./form-autocomplete.interface";
import type { IContract, IPublicContract } from "./form-contract.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IKanban {
  componentType: "kanban";
  id: string;
  boardsProperty: IFormAutocomplete; // propriedade que liga o card a um board (ex: 'boardId')
  userStory?: string;
  guards?: string[];
  dataSource: IApiRequest; // endpoint que retorna os cards (tasks) com a propriedade boardsProperty
  kanbanColumnsProperty: string; // campo que define as colunas (ex: 'status')
  businessRules?: IBusinessRule[];
  kanbanCardItems: {
    property?: string;
    label?: string;
    type?:
      | "title"
      | "subtitle"
      | "description"
      | "video"
      | "image"
      | "images"
      | "icon"
      | "badge"
      | "editable";
    isHtml?: boolean;
    isTimestamp?: boolean;
    callToAction?: {
      link: string;
      usePropertyAsQuery?: boolean;
    };
    dataType: EDataType;
    isExpansible?: boolean;
    conditions?: IFormCondition;
    businessRules?: IBusinessRule[];
    todo?: string;
  }[];
  kanbanFilters?: IFormElement[];
  callsToActionMenu?: {
    icon: string;
    label: string;
    action: {
      linkAfterAction?: {
        endpoint: string;
        propertiesAsQueryParam?: string[];
        propertiesAsPathParam?: string[];
      };
      link?: {
        endpoint: string;
        propertiesAsQueryParam?: string[];
        propertiesAsPathParam?: string[];
      };
      request?: {
        endpoint: string;
        propertiesAsQueryParam?: string[];
        propertiesAsPathParam?: string[];
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
  contracts: IContract[];
  publicContracts?: IPublicContract[];
  archive?: {
    property: string;
    value: string;
    logicalOperator?: "&&" | "!" | "nor" | "||";
  }[];
}
