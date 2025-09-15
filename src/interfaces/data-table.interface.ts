import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export interface IDataTable {
  componentType: "dataTable";
  id: string;
  title: string;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  columns: IDataTableColumn[];
  pagination?: IDataTablePagination;
  filters?: IDataTableFilter[];
  actions?: IDataTableAction[];
  styling?: {
    variant?: "default" | "bordered" | "striped";
    rowClickable?: boolean;
    highlightHoveredRow?: boolean;
  };
}

export interface IDataTableColumn {
  property: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  formatter?: {
    type: "date" | "currency" | "number" | "boolean" | "custom";
    format?: string;
    customFunction?: string;
  };
  renderAs?: "text" | "link" | "badge" | "image" | "icon";
  linkConfig?: {
    route: string;
    paramProperty?: string;
    target?: "_blank" | "_self";
  };
}

export interface IDataTablePagination {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  position?: "top" | "bottom" | "both";
}

export interface IDataTableFilter {
  property: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange" | "number";
  defaultValue?: any;
  options?: { label: string; value: any }[];
}

export interface IDataTableAction {
  icon?: string;
  label: string;
  action: {
    type: "link" | "request" | "event";
    link?: {
      route: string;
      paramProperty?: string;
    };
    request?: {
      endpoint: string;
      method: "GET" | "POST" | "PUT" | "DELETE";
      confirmMessage?: string;
    };
    event?: {
      name: string;
      data?: any;
    };
  };
  visibilityCondition?: {
    property: string;
    operator: "===" | "!==" | ">" | "<" | ">=" | "<=" | "contains";
    value: any;
  };
}
