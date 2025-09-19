import type { IFormCondition } from "./form-condition.interface";
import type { IBusinessRule } from "./project.interface";

interface IStorageConfig {
  path: string;
  fileNameStrategy: "uuid" | "original" | "timestamp";
  visibility: "public" | "private";
}

export interface IFormFile {
  type: "file";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "wysiwyg"
    | "time"
    | "file"
    | "array"
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
    | "uniqueidentifier"
    | "boolean";
  label: string;
  placeholder?: string;
  tooltip?: string;
  accept?: Record<string, string[]>;
  isMultiple?: boolean;
  maxSize?: number;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition[];
  todo?: string;
  validators?: ("onlyImages" | "png" | "jpg" | "pdf")[];
  storageConfig: IStorageConfig;
  businessRules?: IBusinessRule[];
}
