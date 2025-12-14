import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

interface IStorageConfig {
  path: string;
  fileNameStrategy: "uuid" | "original" | "timestamp";
  visibility: "public" | "private";
}

export interface IFormFile {
  type: "file";
  name: string;
  dataType: EDataType;
  label: string;
  placeholder?: string;
  tooltip?: string;
  accept?: Record<string, string[]>;
  isMultiple?: boolean;
  maxSize?: number;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition;
  todo?: string;
  validators?: ("onlyImages" | "png" | "jpg" | "pdf")[];
  storageConfig: IStorageConfig;
  businessRules?: IBusinessRule[];
  elementDescription?: string;
}
