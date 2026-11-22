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
  // Consentimento: ao ligar, o backend grava a data e o usuário em <name>At e <name>By
  // (ao desligar, limpa os dois). O formulário mostra "Registrado em ..." abaixo do switch.
  recordTimestamp?: boolean;
}
