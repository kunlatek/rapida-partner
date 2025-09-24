import type { EDataType } from "../enums/form.enum";
import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";

export interface IDataDetail {
  componentType: "dataDetail";
  id: string;
  title: string;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  headerConfig?: {
    title: {
      property: string;
    };
    subtitle?: {
      property: string;
    };
    imageConfig?: {
      property: string;
      fallbackUrl?: string;
      isAvatar?: boolean;
    };
    statusProperty?: string;
    statusConfig?: {
      [key: string]: {
        label: string;
        color: string;
      };
    };
  };
  sections: IDataDetailSection[];
  relatedData?: IDataDetailRelated[];
  actions?: IDataDetailAction[];
}

export interface IDataDetailSection {
  id: string;
  title: string;
  icon?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  layout: "oneColumn" | "twoColumns" | "threeColumns" | "table";
  properties: IDataDetailProperty[];
}

export interface IDataDetailProperty {
  property: string;
  label: string;
  dataType?: EDataType;
  format?: string;
  linkConfig?: {
    route?: string;
    external?: boolean;
    target?: "_blank" | "_self";
  };
}

export interface IDataDetailRelated {
  id: string;
  title: string;
  componentType: "dataTable" | "dataGrid" | "dataList";
  componentConfig: any;
  dataSource: {
    endpoint: string;
    paramProperty: string;
  };
}

export interface IDataDetailAction {
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
