import type { IDataCard } from "./data-card.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export interface IDataGrid {
  componentType: "dataGrid";
  id: string;
  title: string;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  cardTemplate: IDataCard;
  gridConfig: {
    columns: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    gap: {
      x: number;
      y: number;
    };
  };
  pagination?: IDataGridPagination;
  filters?: IDataGridFilter[];
  emptyState?: {
    message: string;
    icon?: string;
  };
}

export interface IDataGridPagination {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  position?: "top" | "bottom" | "both";
}

export interface IDataGridFilter {
  property: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange" | "number";
  defaultValue?: any;
  options?: { label: string; value: any }[];
}
