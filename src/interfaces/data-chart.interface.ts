import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export type IChartType =
  | "line"
  | "bar"
  | "pie"
  | "doughnut"
  | "radar"
  | "scatter"
  | "bubble"
  | "area"
  | "polarArea";

export type IChartAggregator = "sum" | "avg" | "min" | "max" | "count";

export type IChartLegendPosition = "top" | "bottom" | "left" | "right";

export interface IChartLabelFormatter {
  code?: string;
  pattern?: string;
  flags?: string;
  replacement?: string;
}

export interface IChartAxisOptions {
  title?: {
    display?: boolean;
    text?: string;
  };
  grid?: {
    display?: boolean;
  };
  beginAtZero?: boolean;
  stacked?: boolean;
  min?: number;
  max?: number;
}

export interface IChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  indexAxis?: "x" | "y";
  cutout?: string | number;
  animation?: boolean;
  plugins?: {
    title?: {
      display?: boolean;
      text?: string;
    };
    legend?: {
      display?: boolean;
      position?: IChartLegendPosition;
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: IChartAxisOptions;
    y?: IChartAxisOptions;
  };
}

export interface IDataChart {
  componentType: "dataChart";
  id: string;
  title: string;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  chartType: IChartType;
  dimensions?: {
    width?: string;
    height?: string;
    aspectRatio?: number;
  };
  data: {
    labels: {
      property: string;
      formatter?: IChartLabelFormatter;
    };
    datasets: IChartDataset[];
  };
  options?: IChartOptions;
}

export interface IChartDataset {
  property: string;
  label: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  aggregator?: IChartAggregator;
  stack?: string;
  yAxisID?: string;
  pointRadius?: number;
  hidden?: boolean;
  hoverOffset?: number;
}
