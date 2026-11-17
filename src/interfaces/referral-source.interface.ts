/**
 * Fontes de produto do skeleton "referralCommerce": a loja não vende, só leva
 * o comprador por link de afiliado para o anúncio na fonte de origem.
 *
 * "mercadoLivre" é o catálogo/programa de afiliados do Mercado Livre — não
 * confundir com "mercadoPago" de `IPaymentGateway`, que é gateway de pagamento.
 */
export type TReferralSource = "shopee" | "amazon" | "mercadoLivre";

/**
 * Integração com o programa de afiliados de uma fonte, por ambiente
 * (`IBackend.referralSources`). Uma entrada por fonte.
 */
export interface IReferralSourceIntegration {
  source: TReferralSource;
  // Credenciais da API de afiliado da fonte, com os nomes que cada programa usa
  // (ex.: appId/secret na Shopee, accessKey/secretKey na Amazon).
  credentials: Record<string, string>;
  // Tag/ID de afiliado anexado a todo link gerado para esta fonte.
  affiliateTag: string;
  // Comissão (0..1) assumida quando a API não informa a comissão por item
  // (ex.: tabela por categoria). Usada pelo desempate "highestCommission";
  // sem ela e sem dado por item, a fonte perde esse desempate.
  defaultCommissionRate?: number;
}
