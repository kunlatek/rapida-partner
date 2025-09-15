import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export interface IDashboard {
  componentType: "dashboard";
  id: string;
  title: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  userStory?: string;
  layout: IDashboardSection[];
}

export interface IDashboardSection {
  id: string;
  title?: string;
  columns: number;
  widgets: IDashboardWidget[];
}

export interface IDashboardWidget {
  id: string;
  title: string;
  type: "stats" | "chart" | "table" | "list" | "component";
  width: 1 | 2 | 3 | 4 | 6 | 12; // Colunas que o widget ocupa em um grid de 12 colunas
  height?: "auto" | "small" | "medium" | "large";
  dataSource?: IApiRequest;
  refreshInterval?: number; // Em segundos
  component?: {
    type: "dataTable" | "dataGrid" | "dataCard" | "dataChart";
    config: any; // Referência para outra configuração de componente
  };
  statsConfig?: {
    property: string;
    format?: string;
    icon?: string;
    subtitle?: string;
    trend?: {
      property: string;
      upIsGood?: boolean;
    };
  };
  chartConfig?: {
    type: "line" | "bar" | "pie" | "doughnut" | "radar";
    properties: {
      x: string;
      y: string | string[];
    };
    options?: any; // Opções específicas do chart
  };
}
