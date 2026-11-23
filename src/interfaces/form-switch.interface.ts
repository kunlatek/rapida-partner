import type { TTranslatable } from "./translatable.interface";
import type { IFormCondition } from "./condition.interface";
import type { IBusinessRule } from "./project.interface";

export interface IFormSwitch {
  type: "switch";
  name: string;
  label: TTranslatable;
  tooltip?: TTranslatable;
  isDisabled?: boolean;
  isDisabledOnUpdate?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  conditions?: IFormCondition;
  todo?: string;
  businessRules?: IBusinessRule[];
  elementDescription?: string;
  space?: 1 | 2 | 3 | 4;
  // Consentimento com histórico: ao ligar, o backend grava a data e o usuário em <name>At e
  // <name>By; ao desligar, grava a revogação em <name>RevokedAt e <name>RevokedBy, sem apagar
  // o aceite. Ligar de novo grava o novo aceite e limpa a revogação. Evite names que gerem
  // campos já existentes (e.g.: "created" vira createdAt).
  recordTimestamp?: boolean;
}
