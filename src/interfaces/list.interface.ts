import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IContract, IPublicContract } from "./form-contract.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";
import type { TTranslatable } from "./translatable.interface";
import type { ISelectOption } from "./form-select.interface";
import type { TTone } from "./tone.interface";

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
    tones?: Record<string, TTone>; // só em type "badge" (nos outros tipos é ignorado): tom de cada valor. e.g.: { "paid": "success", "overdue": "danger" }
    mobilePriority?: 1 | 2 | 3; // 1 e 2 aparecem no card do celular; 3 só no desktop
    relativeDate?: "plain" | "deadline"; // data com texto relativo abaixo ("há 3 dias"); "deadline" pinta o passado de vermelho e os próximos 7 dias de âmbar
    columnGroup?: TTranslatable; // grupo da coluna (e.g.: "Valores"), escrito acima do nome e usado no seletor de colunas; colunas do mesmo grupo devem ficar juntas
    conditions?: IFormCondition;
    businessRules?: IBusinessRule[];
    todo?: string;
  }[]; // properties taken from dataSource
  listFilters?: IFormElement[]; // filters to be applied on dataSource
  quickFilters?: string[]; // até 2 `name` de listFilters que ficam ao lado da busca; os demais vão para a área "Mais filtros". Sem isso, todos ficam na área "Filtros"
  tabs?: IListTabs; // abas com contador acima da tabela, uma por valor de `property`, mais "Todos"
  kpis?: IListKpi[]; // até 4 números-resumo acima da tabela; clicar num deles filtra a lista
  columnViews?: IListColumnView[]; // visualizações de colunas (e.g.: Resumo, Fiscal, Completo); com elas aparece o seletor de colunas e a escolha fica salva por pessoa e por tela
  stickyStart?: boolean; // em tabelas largas, a coluna de identificação (title) fica fixa à esquerda e as ações à direita enquanto o meio rola
  views?: TListView[]; // modos de ver a lista; o primeiro é o padrão. Com os dois, aparece o seletor Tabela/Lista e a escolha fica salva por pessoa e por tela
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

export interface IListTabOption extends Pick<ISelectOption, "label" | "value"> {
  tone?: TTone; // cor do contador da aba
}

export interface IListTabs {
  property: string; // e.g.: "status"
  options?: IListTabOption[]; // sem options, usa as opções do select de mesmo nome no form do módulo
  tones?: Record<string, TTone>; // tom de cada aba pelo valor, para usar com as opções do select. e.g.: { "overdue": "danger" }
  showCounts?: boolean; // contador em cada aba; padrão true
}

export interface IListPagination {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  position?: "top" | "bottom" | "both";
}
// Número-resumo acima da tabela. Sem sumOf, conta os registros que passam no filtro;
// com sumOf, soma esse campo numérico. Clicar aplica o filtro na lista.
export interface IListKpi {
  label: TTranslatable;
  description?: TTranslatable; // contexto abaixo do valor, e.g.: "contas vencidas"
  filter?: IListKpiCondition[]; // condições que o registro precisa cumprir (todas), e.g.: [{ field: "dueDate", op: "lt", value: "$today" }]
  sumOf?: string; // campo numérico do form do módulo, e.g.: "accountAmount"
  tone?: TTone | "brand"; // "brand" no número principal (no máximo 1), "danger" para atraso, "warning" para hoje
}

// "table": tabela com colunas, para comparar e ordenar. "list": um card largo por registro, com
// avatar, título, situação e até 4 campos, para entender e agir em cada um.
export type TListView = "table" | "list";

export interface IListColumnView {
  label: TTranslatable; // e.g.: "Resumo"
  columns: string[]; // property de cada listItem visível nesta visualização; a coluna title aparece sempre
}

export type TListKpiOperator = "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | "in";

export interface IListKpiCondition {
  field: string; // name de um campo do form do módulo
  op: TListKpiOperator;
  value: string | number | boolean | (string | number)[]; // "$today" e "$tomorrow" viram as datas do dia; com "in", uma lista
}
