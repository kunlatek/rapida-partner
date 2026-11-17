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
  /**
   * - `"anonymous"`: sem autenticação.
   * - `"trustedCallers"`: exige JWT de serviço assinado por um dos `IBackend.trustedCallers`
   *   do ambiente ativo (RFC 7523). Sem chamadores declarados, ninguém tem acesso.
   */
  access: "anonymous" | "trustedCallers";
  /**
   * Origens de browser/app liberadas via CORS. Só restringe browsers — não protege
   * contra chamadas servidor-a-servidor (use `access: "trustedCallers"` para isso).
   */
  allowedOrigins?: string[];
  /**
   * Somas agrupadas por um campo, calculadas no banco e expostas com o mesmo
   * `access` do contrato em `GET <endpoint>/aggregations/<id>` (aceita o mesmo
   * `filters` da listagem e respeita o workspace). Ex.: saldo de estoque por
   * produto sem varrer todas as movimentações.
   */
  aggregations?: IContractAggregation[];
  request?: IContractRequest;
  conditions?: IFormCondition;
  businessRules?: IBusinessRule[];
  userStory?: string;
}

/**
 * Agregação de um contrato público. A resposta é uma lista de
 * `{ _id: <valor de groupBy>, <campo de sum>: <total> }`.
 */
export interface IContractAggregation {
  // Último segmento da rota: GET <endpoint>/aggregations/<id>.
  id: string;
  // Campo pelo qual os registros são agrupados (ex.: "productId").
  groupBy: string;
  // Campos numéricos somados em cada grupo (ex.: ["inputQuantity"]).
  sum: string[];
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
  relationship: "many-to-many" | "one-to-many" | "one-to-one" | "many-to-one";
  fields?: IContractRequestField[];
  isHidden?: boolean;
}