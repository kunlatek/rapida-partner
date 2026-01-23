import type { EDataType } from "../enums/form.enum";
import type { IFormCondition } from "./condition.interface";
import type { IForm } from "./form.interface";
import type { IBusinessRule } from "./project.interface";

export interface IContract {
  id: string;
  endpoint: string;
  actions: ("create" | "get" | "getById" | "update" | "softDelete" | "hardDelete" | "clone" | "sendEmail")[];
  request?: IContractRequest;
  conditions?: IFormCondition;
  businessRules?: IBusinessRule[];
  userStory?: string;
}

export interface IPublicContract {
  id: string;
  endpoint: string;
  actions: ("create" | "get" | "getById" | "update" | "softDelete" | "hardDelete" | "clone" | "sendEmail")[];
  permissionedUrls: string[];
  request?: IContractRequest;
  conditions?: IFormCondition;
  businessRules?: IBusinessRule[];
  userStory?: string;
}

export interface IContractRequest {
  entity: string,
  relatedEntity?: {
    entity: string;
    connectionAttribute: string;
    fieldsFromEntity: {
      fields: IForm;
      contractId: string;
    }[]
  },
  description?: string,
  fields: IContractRequestField[]
  uniqueConstraints?: {
    identificator: string;
    fields: string[];
  }[];
}

export interface IContractRequestField {
  name: string;
  dataType: EDataType;
  requiredOneOf?: string[];
  isRequired?: boolean;
  isHidden?: boolean;
  foreignKey?: IContractRequestFieldForeignKey;
  isPrimaryKey?: boolean;
  minSize?: number;
  maxSize?: number;
  enum?: (string | number)[];
  isUnique?: boolean;
  uniqueComposedFields?: string[];
  defaultValue?: string | number | boolean;
  actionsExceptions?: ("create" | "getOne" | "getAll" | "update" | "softDelete" | "hardDelete" | "clone")[];
  businessRules?: IBusinessRule[];
}

interface IContractRequestFieldForeignKey {
  entity: string;
  connectionAttribute: string;
  relationship: "many-to-many" | "one-to-many" | "one-to-one"
  fields?: IContractRequestField[];
  isHidden?: boolean;
}