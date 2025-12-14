import type { IBusinessRule } from "./project.interface";

// Os tipos possíveis
type ConditionType = "property" | "enum" | "form" | "code" | "array" | "button";

// Conteúdo da condição (sem o type, pois a chave já diz o que é)
interface IConditionBody {
  elements?: IConditionElement[];
  code?: IConditionCode;
  businessRules?: IBusinessRule[];
  conditionResponse?: "show" | "hide" | "enable" | "disable" | "fillFields";
  fillFields?:Array<{ fieldKey: string; value: any }>;
  buttonId?: string;
}

// A estrutura principal agora é um objeto onde as chaves são opcionais,
// mas se existirem, são únicas por definição.
export type IFormCondition = {
  [K in ConditionType]?: IConditionBody;
};

interface IConditionElement {
  key: string;
  value?: any;
  array?: string;
  comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
  logicalOperator?: "&&" | "!" | "nor" | "||";
}

interface IConditionCode {
  triggerField: string;
  code: string;
}
