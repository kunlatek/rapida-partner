import type { EDataType } from "../enums/form.enum";
import type { IConditionElement } from "./condition.interface";
import type { IChartAggregator } from "./data-chart.interface";
import type {
  IDashboardEmptyState,
  IDashboardLinkAction,
} from "./dashboard-widget.interface";
import type { IApiRequest } from "./form-input.interface";
import type { IBusinessRule } from "./project.interface";
import type { TTranslatable } from "./translatable.interface";
import type { TTone } from "./tone.interface";

/**
 * Datas relativas, resolvidas no navegador no momento da consulta.
 *
 * - "$now": o instante atual.
 * - "$today" / "$tomorrow": o dia de hoje / de amanhã no calendário de quem
 *   está usando, à meia-noite UTC. É assim que os campos de data sem hora
 *   (dataType "date") são gravados, então `dueDate < "$today"` significa
 *   "vence antes de hoje" sem erro de fuso.
 * - "$startOfMonth" / "$startOfNextMonth" e "$startOfYear" / "$startOfNextYear":
 *   mesma regra, no primeiro dia do período.
 *
 * Use intervalos semiabertos para recortar períodos: o mês atual é
 * `>= "$startOfMonth"` e `< "$startOfNextMonth"`.
 */
export type TDataStatRelativeDate =
  | "$now"
  | "$today"
  | "$tomorrow"
  | "$startOfMonth"
  | "$startOfNextMonth"
  | "$startOfYear"
  | "$startOfNextYear";

type TDataStatScalar = string | number | boolean | null;

/**
 * Filtro fixo aplicado antes de calcular o valor. Os filtros de um IDataStat
 * são combinados com "e". Os operadores são os mesmos de IConditionElement;
 * "in"/"nin" recebem uma lista em `value`.
 */
export interface IDataStatFilter {
  key: string;
  comparisonOperator: IConditionElement["comparisonOperator"];
  value: TDataStatScalar | TDataStatScalar[] | TDataStatRelativeDate;
}

/**
 * Tom do card: "neutral" (padrão), "success" (valor em verde), "warning"
 * (card âmbar) e "danger" (card vermelho).
 */
export type TDataStatTone = TTone;

/**
 * Regra de tom avaliada sobre o valor já calculado, no mesmo formato de
 * IDataStatFilter sem o `key`. Ex.: `{ comparisonOperator: ">", value: 0,
 * tone: "danger" }` deixa o card vermelho quando houver algo vencido; com
 * valor de data, `{ comparisonOperator: "<", value: "$tomorrow", tone: "warning" }`
 * avisa o que vence até hoje.
 */
export interface IDataStatToneRule extends Omit<IDataStatFilter, "key"> {
  tone: TDataStatTone;
}

/**
 * Indicador numérico (KPI) do painel: um único valor calculado sobre os
 * registros de um endpoint, como um IDataChart sem agrupamento. Hoje o gerador
 * só o desenha em IProject.dashboard.
 *
 * Exemplos:
 * - total vencido: `sum` de "amount", filtros `status in [...]` e `dueDate < "$today"`, dataType CURRENCY;
 * - próximo vencimento: `min` de "dueDate", filtro `dueDate >= "$today"`, dataType DATE;
 * - quantidade de registros: `count`, sem `property`.
 */
export interface IDataStat {
  componentType: "dataStat";
  id: string;
  title: TTranslatable;
  // Texto de apoio abaixo do valor (ex.: "contas em aberto").
  subtitle?: TTranslatable;
  userStory?: string;
  icon?: string;
  guards?: "isAuthenticated" | "isAuthorized";
  businessRules?: IBusinessRule[];
  dataSource: IApiRequest;
  filters?: IDataStatFilter[];
  value: {
    aggregator: IChartAggregator;
    // Campo agregado. Obrigatório em todos os agregadores, exceto "count".
    property?: string;
    // Define a formatação: CURRENCY (moeda), DATE/DATETIME/TIMESTAMP (data),
    // INTEGER, DECIMAL etc. Sem dataType, o valor é exibido como número.
    dataType?: EDataType;
  };
  // Cor do card conforme o valor. As regras são avaliadas em ordem e a
  // primeira que casar define o tom; sem nenhuma, vale `default` ("neutral").
  tone?: {
    default?: TDataStatTone;
    rules?: IDataStatToneRule[];
  };
  // Máximo de registros lidos para "sum" e "avg" (padrão 1000). "count",
  // "min" e "max" são resolvidos pelo backend e não dependem desse limite.
  limit?: number;
  // Rota interna aberta ao clicar no card inteiro (ex.: "/payable-receivable-accounts").
  link?: string;
  // Chamada de ação no rodapé do card (ex.: "Resolver agora"). Com `action`, o
  // card deixa de ser clicável por inteiro e só a ação navega.
  action?: IDashboardLinkAction;
  // Substitui "Nenhum registro encontrado." quando não há valor (ex.: "min"
  // sem nenhum registro).
  emptyState?: IDashboardEmptyState;
  // Largura na grade de 4 colunas do painel, como `space` dos campos de formulário.
  space?: 1 | 2 | 3 | 4;
}
