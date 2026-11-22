import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IFormAutocomplete } from "./form-autocomplete.interface";
import type { IContract, IPublicContract } from "./form-contract.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IFormSelect } from "./form-select.interface";
import type { IFormElement } from "./form.interface";
import type { IBusinessRule } from "./project.interface";
import type { TListTone } from "./list.interface";
import type { TTranslatable } from "./translatable.interface";

export interface IKanban {
  componentType: "kanban";
  id: string;
  relatedFormId?: string; // <-- NOVO: ID do formulário relacionado para criar/editar cards
  itemsLabel?: TTranslatable; // nome dos cards no plural, usado no resumo e na contagem. e.g.: "tarefas"
  createLabel?: TTranslatable; // texto do botão de criar. e.g.: "Nova tarefa"
  columnTones?: Record<string, TListTone>; // cor do ponto de cada coluna, pelo valor da coluna. e.g.: { "blocked": "danger" }
  doneColumns?: string[]; // valores das colunas finais: cards nelas não contam como atrasados
  hideEmptyColumns?: boolean; // começa recolhendo as colunas sem cards; padrão true
  quickFilters?: IKanbanQuickFilter[]; // botões de filtro rápido com contador, abaixo da busca
  boardsProperty: IFormAutocomplete;
  userStory?: string;
  guards?: string[];
  dataSource: IApiRequest;
  kanbanColumnsProperty: IFormAutocomplete | IFormSelect;
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
      | "editable"
      | "person"
      | "level";
    isHtml?: boolean;
    isTimestamp?: boolean;
    callToAction?: {
      link: string;
      usePropertyAsQuery?: boolean;
    };
    dataType: EDataType;
    isExpansible?: boolean;
    tones?: Record<string, TListTone>; // type "badge": tom de cada valor. e.g.: { "1": "danger" }
    icons?: Record<string, string>; // type "badge": ícone Lucide de cada valor. e.g.: { "1": "arrow-up" }
    relativeDate?: "plain" | "deadline"; // datas: texto relativo ("em 3 dias"); "deadline" pinta o atraso de vermelho e os próximos 7 dias de âmbar
    levels?: (string | number)[]; // type "level": valores do menor para o maior, um tracinho por valor
    roleShort?: string; // type "person": letra do papel no avatar. e.g.: "D"
    labelFields?: string[]; // type "person": campos do nome da pessoa; sem isso, os do autocomplete de mesmo nome no form relacionado
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

export interface IKanbanQuickFilter {
  id: string;
  label: TTranslatable;
  tone?: TListTone; // cor do ponto do botão
  property: string;
  match: "overdue" | "dueToday" | "equals"; // "overdue" e "dueToday" comparam a data de `property` com hoje
  value?: string | number | boolean; // usado com "equals"
}
