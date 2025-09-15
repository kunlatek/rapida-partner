import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export interface IDataCard {
  componentType: "dataCard";
  id: string;
  title: string;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  layout: "horizontal" | "vertical";
  imageConfig?: {
    property: string;
    fallbackUrl?: string;
    position?: "top" | "left" | "right";
    aspectRatio?: "1:1" | "4:3" | "16:9";
  };
  titleConfig: {
    property: string;
    isLink?: boolean;
    linkRoute?: string;
    linkParamProperty?: string;
  };
  subtitleConfig?: {
    property: string;
  };
  descriptionConfig?: {
    property: string;
    maxLength?: number;
    showReadMore?: boolean;
  };
  properties: IDataCardProperty[];
  actions?: IDataCardAction[];
  styling?: {
    variant?: "default" | "elevated" | "flat" | "outlined";
    cardClickable?: boolean;
  };
}

export interface IDataCardProperty {
  property: string;
  label: string;
  type?:
    | "text"
    | "date"
    | "currency"
    | "number"
    | "boolean"
    | "badge"
    | "icon"
    | "char"
    | "nchar"
    | "varchar"
    | "varchar2"
    | "nvarchar"
    | "longtext"
    | "clob"
    | "nclob"
    | "decimal"
    | "numeric"
    | "integer"
    | "float"
    | "double"
    | "real"
    | "timestamp"
    | "datetime"
    | "datetime2"
    | "uniqueidentifier";
  format?: string;
  isHtml?: boolean;
}

export interface IDataCardAction {
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
  styling?: {
    variant?: "primary" | "secondary" | "text" | "outlined";
    size?: "sm" | "md" | "lg";
  };
}
