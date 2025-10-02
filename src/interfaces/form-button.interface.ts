import type { IFormCondition } from "./condition.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IForm } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormButton {
  type: "button";
  id: string;
  label: string;
  actionType: "submit" | "reset" | "link" | "apiRequest" | "modal";
  todo?: string;
  icon?: string;
  tooltip?: string;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  conditions?: IFormCondition[];
  apiRequest?: IApiRequest;
  onSuccessRedirect?: {
    url: string;
    openIn: "sameTab" | "newTab" | "newWindow";
  };
  onFailRedirect?: {
    url: string;
    openIn: "sameTab" | "newTab" | "newWindow";
  };
  modal?: {
    id: string;
    title: string;
    modal: IForm;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
    closeButtonLabel?: string;
    actionButtonLabel?: string;
    actionButtonType?: "submit" | "reset" | "link" | "apiRequest" | "modal";
    actionButtonApiRequest?: IApiRequest;
    actionButtonBusinessRules?: IBusinessRule[];
  },
  link?: {
    url: string;
    openInNewTab?: boolean;
  };
  businessRules?: IBusinessRule[];
  elementDescription?: string;
}
