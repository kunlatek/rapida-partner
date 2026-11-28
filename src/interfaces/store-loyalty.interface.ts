import type { TStoreWeekday } from "./store-settings.interface";

/**
 * Nível de fidelidade da loja (funcionalidade "loyalty"), o mesmo cadastro do
 * loyaltyTier do rapida-projects: na loja, minVisits conta os pedidos pagos do
 * cliente nos últimos periodDays dias. O nível do cliente é o de maior
 * minVisits que ele atinge; não é gravado, é calculado a cada consulta.
 * Lido pela loja por IMarketplace.loyaltyTiersEndpoint.
 */
export interface IStoreLoyaltyTier {
  name: string;
  minVisits: number;
  periodDays: number;
  description?: string;
}

/**
 * Vantagem de um nível (o mesmo cadastro do loyaltyBenefit): na loja, vira um
 * desconto automático em % no fechamento, calculado no servidor. Fidelidade e
 * cupom não somam: vale o maior. Sem loyaltyTierIds, vale para qualquer nível
 * atingido. Lida pela loja por IMarketplace.loyaltyBenefitsEndpoint.
 */
export interface IStoreLoyaltyBenefit {
  name: string;
  discountPercentage?: number;
  isActive: boolean;
  loyaltyTierIds?: string[];
  // Sem dias, vale todos os dias (no fuso STORE_LOYALTY_TIME_ZONE).
  weekDays?: TStoreWeekday[];
  // A loja não conhece o aniversário do cliente: vantagem só no mês de aniversário não vale na loja.
  isBirthdayMonthOnly?: boolean;
  validFrom?: string;
  validUntil?: string;
}
