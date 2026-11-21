import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IContract, IPublicContract } from "./form-contract.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";
import type { TTranslatable } from "./translatable.interface";

export interface IList {
  componentType: "list";
  id: string; // named according to component file name (<id>.<componentType>.ts)
  title: TTranslatable;
  description?: TTranslatable; // frase abaixo do título da lista, dizendo para que ela serve
  userStory?: string;
  guards?: string[];
  dataSource: IApiRequest;
  businessRules?: IBusinessRule[];
  isListItemSelectable?: boolean;
  listItems: {
    property?: string; // property taken from dataSource response. e.g.: "email"
    label?: TTranslatable; // label to property. e.g.: "E-mail"
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
    tones?: Record<string, TListTone>; // type "badge": tom de cada valor. e.g.: { "paid": "success", "overdue": "danger" }
    mobilePriority?: 1 | 2 | 3; // 1 e 2 aparecem no card do celular; 3 só no desktop
    relativeDate?: "plain" | "deadline"; // data com texto relativo abaixo ("há 3 dias"); "deadline" pinta o passado de vermelho e os próximos 7 dias de âmbar
    conditions?: IFormCondition;
    businessRules?: IBusinessRule[];
    todo?: string;
  }[]; // properties taken from dataSource
  listFilters?: IFormElement[]; // filters to be applied on dataSource
  quickFilters?: string[]; // até 2 `name` de listFilters que ficam ao lado da busca; os demais vão para "Mais filtros". Sem isso, os 2 primeiros
  tabs?: IListTabs; // abas com contador acima da tabela, uma por valor de `property`, mais "Todos"
  listActions?: IFormElement[]; // actions that can be performed on the list
  cardAsALink?: {
    link: string; // e.g.: "/user"
    propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
    propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
  };
  callsToActionMenu?: {
    icon: string; // Material icons e.g: "pencil"
    label: TTranslatable; // e.g: "Editar"
    action: {
      linkAfterAction?: {
        // frontend url to be redirected on action completition
        endpoint: string; // e.g.: "/user"
        propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
        propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
      };
      link?: {
        // frontend url to be redirected on action completition
        endpoint: string; // e.g.: "/user"
        propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
        propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
      },
      request?: {
        // backend request endpoint that must be processed before link redirection
        endpoint: string; // e.g.: "/user"
        propertiesAsQueryParam?: string[]; // if, for example, ["_id", "email"], then "/user?_id=value&email=value"
        propertiesAsPathParam?: string[]; // if, for example, ["_id", "email"], then "/user/<_id>/<email>"
        verb: "get" | "post" | "put" | "softDelete" | "hardDelete";
        dialog?: {
          title: TTranslatable;
          message: TTranslatable;
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
    property: string; // e.g.: "status"
    value: string; // e.g.: "finished"
    logicalOperator?: "&&" | "!" | "nor" | "||"; // && as default
  }[];
  pagination?: IListPagination;
}

export type TListTone = "neutral" | "success" | "warning" | "danger";

export interface IListTabOption {
  value: string | number | boolean;
  label: TTranslatable;
  tone?: TListTone; // cor do contador da aba
}

export interface IListTabs {
  property: string; // e.g.: "status"
  options?: IListTabOption[]; // sem options, usa as opções do select de mesmo nome no form do módulo
  showCounts?: boolean; // contador em cada aba; padrão true
}

export interface IListPagination {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  position?: "top" | "bottom" | "both";
}