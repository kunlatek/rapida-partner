import type { TTranslatable } from "./translatable.interface";
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormPatternInput {
  type: "pattern";
  name: string;
  label: TTranslatable;
  format: string;
  placeholder?: TTranslatable;
  tooltip?: TTranslatable;
  isDisabled?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition;
  todo?: string;
  businessRules?: IBusinessRule[];
}
