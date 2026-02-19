import type { IDataCard } from "./data-card.interface";
import type { IDataChart } from "./data-chart.interface";
import type { IDataDetail } from "./data-detail.interface";
import type { IDataGrid } from "./data-grid.interface";
import type { IDataTable } from "./data-table.interface";
import type { IE2e } from "./e2e.interface";
import type { IFlowChart } from "./form-flowchart.interface";
import type { IForm } from "./form.interface";
import type { IPanel } from "./layout-panel.interface";
import type { IList } from "./list.interface";
import type { IBackend } from "./project-backend.interface";
import type { IStyle } from "./project-style.interface";

export interface IProject {
  id: string;
  title: string;
  description: string;
  businessPlan?: IBusinessPLan;
  businessRules?: IBusinessRule[];
  skeleton:
  | "backoffice"
  | "marketplace"
  | "landingPage"
  | "socialNetwork";
  flows?: {
    authentication?: boolean;
    permission?: boolean;
    invitation?: boolean;
    registration?: boolean;
  };
  frontend?: IFrontend;
  backend?: IBackend;
  e2e?: IE2e;
  modules?: IModule[];
  styles?: IStyle[];
  flowChart?: IFlowChart;
  dashboard?: IComponent[];
}

interface IFrontend {
  framework: "angular" | "flutter" | "react" | "reactnative" | "svelte" | "vue";
  uiKit: "antdesign" | "bootstrap" | "material" | "flowbite";
}

interface IBusinessPLan {
  businessValue: string;
  targetMarket: string;
  benchmarkings: string;
  legalIssues: string;
  ethicalIssues: string;
  afterSales: string;
  monetization?: string;
}

export interface IBusinessRule {
  rule: {
    description: string;
    subrules?: {
      description: string;
      implementation?: {
        type: "frontend" | "backend" | "both";
        details: string;
      };
      backendComplementaryCode?: {
        framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
        code: {
          codeStartLocationReference: "before" | "after" | "replace";
          codeStartLocation: string;
          code: string;
        }[];
      };
      frontendComplementaryCode?: {
        framework: "angular" | "flutter" | "react" | "reactnative" | "svelte" | "vue";
        code: {
          codeStartLocationReference: "before" | "after" | "replace";
          codeStartLocation: string;
          code: string;
        }[];
      };
    }[];
    implementation?: {
      type: "frontend" | "backend" | "both";
      details: string;
    };
    backendComplementaryCode?: {
      framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
      code: {
        codeStartLocationReference: "before" | "after" | "replace";
        codeStartLocation: string;
        code: string;
      }[];
    };
    frontendComplementaryCode?: {
      framework: "angular" | "flutter" | "react" | "reactnative" | "svelte" | "vue";
      code: {
        codeStartLocationReference: "before" | "after" | "replace";
        codeStartLocation: string;
        code: string;
      }[];
    };
  };
}

export interface IModule {
  id: string;
  title: string;
  icon: string;
  components: IComponent[];
  businessRules?: IBusinessRule[];
  todo?: ITodo[];
}

export interface ITodo {
  title: string;
  description: string;
}

export type IComponent =
  | IForm
  | IList
  | IDataTable
  | IDataCard
  | IDataGrid
  | IDataDetail
  | IDataChart
  | IPanel;
