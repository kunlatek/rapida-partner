import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";
import type { TTranslatable } from "./translatable.interface";
import type {
  IDashboardEmptyState,
  IDashboardLinkAction,
} from "./dashboard-widget.interface";

// "progressList": barras horizontais em HTML (rótulo, barra e número), sem
// canvas. Usa a ordem das opções do select do campo agrupado, quando houver,
// e o primeiro dataset. Bom para contagem por etapa/status.
export type IChartType =
  | "line"
  | "bar"
  | "pie"
  | "doughnut"
  | "radar"
  | "scatter"
  | "bubble"
  | "area"
  | "polarArea"
  | "progressList";

// Cores do tema, para não prender o gráfico a um hex: "primary" segue
// IProject.styles; as demais são as de status (cinza, verde, âmbar, vermelho).
export type TChartColorToken = "neutral" | "primary" | "success" | "warning" | "danger";

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
    text?: TTranslatable;
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
      text?: TTranslatable;
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
  title: TTranslatable;
  // Texto abaixo do título. Aceita {{total}} (soma dos valores exibidos),
  // ex.: { "pt-BR": "{{total}} tarefas no total" }.
  subtitle?: TTranslatable;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  chartType: IChartType;
  // Link no canto do card (ex.: "Abrir quadro").
  action?: IDashboardLinkAction;
  // Substitui a mensagem padrão quando não há dados.
  emptyState?: IDashboardEmptyState;
  limit?: number;
  dimensions?: {
    width?: string;
    height?: string;
    aspectRatio?: number;
  };
  data: {
    labels: {
      property: string;
      formatter?: IChartLabelFormatter;
      // Cor por valor do campo agrupado (o valor cru, ex.: "blocked"), em
      // "progressList". Valores sem cor usam "primary".
      colors?: Record<string, TChartColorToken>;
    };
    datasets: IChartDataset[];
  };
  options?: IChartOptions;
}

export interface IChartDataset {
  property: string;
  label: TTranslatable;
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
