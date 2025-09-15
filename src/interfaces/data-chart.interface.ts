import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export interface IDataChart {
  componentType: "dataChart";
  id: string;
  title: string;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  chartType:
    | "line"
    | "bar"
    | "pie"
    | "doughnut"
    | "radar"
    | "scatter"
    | "bubble"
    | "area"
    | "polarArea";
  dimensions: {
    width?: string;
    height?: string;
    aspectRatio?: number;
  };
  data: {
    labels: {
      property: string;
      formatter?: string;
    };
    datasets: IChartDataset[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
      title?: {
        display?: boolean;
        text?: string;
      };
      legend?: {
        display?: boolean;
        position?: "top" | "bottom" | "left" | "right";
      };
      tooltip?: {
        enabled?: boolean;
      };
    };
    scales?: {
      x?: {
        title?: {
          display?: boolean;
          text?: string;
        };
        grid?: {
          display?: boolean;
        };
      };
      y?: {
        title?: {
          display?: boolean;
          text?: string;
        };
        grid?: {
          display?: boolean;
        };
        beginAtZero?: boolean;
      };
    };
  };
}

export interface IChartDataset {
  property: string;
  label: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number; // Para linhas curvas
  aggregator?: "sum" | "avg" | "min" | "max" | "count";
}
