import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormSwitch {
  type: "switch";
  name: string;
  label: string;
  tooltip?: string;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition[];
  todo?: string;
  businessRules?: IBusinessRule[];
}
