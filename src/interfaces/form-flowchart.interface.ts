import type { IBusinessRule } from "./project.interface";

export interface IFlowChart {
  actors: IActor[];
}

export interface IActor {
  name: string;
  actionsWithElements: IActionWithElement[];
  businessRules?: IBusinessRule[];
}

export interface IActionWithElement {
  verb: "create" | "get" | "getById" | "update" | "softDelete" | "hardDelete" | "clone" | "sendEmail";
  elements?: IFlowChartElement[];
  businessRules?: IBusinessRule[];
}

export interface IFlowChartElement {
  name: string;
  businessRules?: IBusinessRule[];
}
