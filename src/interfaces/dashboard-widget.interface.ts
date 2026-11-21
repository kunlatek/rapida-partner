import type { TTranslatable } from "./translatable.interface";

/**
 * Atalho de criação: abre o formulário de cadastro de `formId` (o `id` de um
 * IForm de algum módulo, com a ação "create" no contrato). Declarado uma vez em
 * IProject.menu.quickCreate e usado pelo botão "Criar novo" do painel e pelo
 * card IDashboardQuickCreate. Só aparece para quem pode criar naquele módulo.
 *
 * `label` é declarado porque depende do gênero da palavra ("Nova conta",
 * "Novo compromisso"), o que não dá para montar a partir do título do form.
 */
export interface IQuickCreateItem {
  formId: string;
  label: TTranslatable;
  icon?: string;
}

/**
 * Card "Consumo de serviços" no painel: saldo e uso das integrações com
 * monitoramento de custo (deepseekIntegration/mongodbIntegration com
 * service "cost"). Requer ao menos uma delas no projeto. Só em IProject.dashboard.
 */
export interface IDashboardBudgetMonitor {
  componentType: "budgetMonitor";
  id: string;
}

/**
 * Card de atalhos de criação no painel, com os itens de
 * IProject.menu.quickCreate. Só em IProject.dashboard.
 */
export interface IDashboardQuickCreate {
  componentType: "quickCreate";
  id: string;
  title?: TTranslatable;
}

/**
 * Link de ação de um card do painel (ex.: "Abrir quadro", "Resolver agora").
 * `link` é uma rota interna.
 */
export interface IDashboardLinkAction {
  label: TTranslatable;
  link: string;
}

/**
 * Estado vazio de um card do painel (IDataChart/IDataStat sem dados): ícone,
 * título, explicação e ações para o usuário sair dele (ex.: "Configurar perfil
 * fiscal"). A primeira ação "primary" vira o botão principal. Sem emptyState,
 * o card mostra a mensagem padrão.
 */
export interface IDashboardEmptyState {
  icon?: string;
  title?: TTranslatable;
  description?: TTranslatable;
  actions?: (IDashboardLinkAction & { variant?: "primary" | "secondary" })[];
}
