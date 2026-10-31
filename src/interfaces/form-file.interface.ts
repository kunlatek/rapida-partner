import type { TTranslatable } from "./translatable.interface";
import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IStorageConfig {
  path: string;
  fileNameStrategy: "uuid" | "original" | "timestamp";
  visibility: "public" | "private";
}

export interface IFormFile {
  type: "file";
  name: string;
  dataType: EDataType;
  label: TTranslatable;
  placeholder?: TTranslatable;
  tooltip?: TTranslatable;
  accept?: Record<string, string[]>;
  isMultiple?: boolean;
  isProfilePicture?: boolean;
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
  space?: 1 | 2 | 3 | 4;
}
