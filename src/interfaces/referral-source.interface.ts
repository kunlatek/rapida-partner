/**
 * Fontes de produto do skeleton "referralCommerce": a loja não vende, só leva
 * o comprador por link de afiliado para o anúncio na fonte de origem.
 *
 * "mercadoLivre" é o catálogo/programa de afiliados do Mercado Livre — não
 * confundir com "mercadoPago" de `IPaymentGateway`, que é gateway de pagamento.
 */
export type TReferralSource = "shopee" | "amazon" | "mercadoLivre";

/**
 * Campos comuns da integração com o programa de afiliados de uma fonte.
 */
interface IReferralSourceIntegrationBase {
  // Comissão (0..1) assumida quando a API não informa a comissão por item
  // (ex.: tabela por categoria). Usada pelo desempate "highestCommission";
  // sem ela e sem dado por item, a fonte perde esse desempate.
  defaultCommissionRate?: number;
  // Prazo de entrega (dias) assumido para os anúncios da fonte. Nenhuma API de
  // afiliado informa prazo por item hoje; sem este valor, a fonte perde o
  // desempate "fastestDelivery". Prazo real por CEP está fora do escopo.
  defaultDeliveryDays?: number;
}

/**
 * Shopee Afiliados (Open API). AppID e Secret ficam na página Open API do painel
 * de afiliado. A API devolve o link de oferta já atribuído à conta dona do AppID,
 * por isso `affiliateTag` é opcional: quando presente, vai como sub-id do link.
 */
export interface IShopeeReferralIntegration extends IReferralSourceIntegrationBase {
  source: "shopee";
  credentials: {
    appId: string;
    secret: string;
  };
  affiliateTag?: string;
}

/**
 * Amazon Associates (Creators API). Credenciais do Associates Central; a API só
 * é liberada depois de vendas qualificadas no marketplace.
 */
export interface IAmazonReferralIntegration extends IReferralSourceIntegrationBase {
  source: "amazon";
  credentials: {
    credentialId: string;
    credentialSecret: string;
    // Versão da credencial; define o endereço de emissão do token. Padrão do gerador se omitida.
    version?: string;
    // Marketplace alvo (ex.: "www.amazon.com.br"). Padrão do gerador se omitido.
    marketplace?: string;
  };
  // Tag de associado (partnerTag) anexada a todo link.
  affiliateTag: string;
}

/**
 * Mercado Livre: aplicação no portal de desenvolvedores (clientId/clientSecret)
 * para o catálogo e programa de afiliados para a comissão do link.
 */
export interface IMercadoLivreReferralIntegration extends IReferralSourceIntegrationBase {
  source: "mercadoLivre";
  credentials: {
    clientId: string;
    clientSecret: string;
    // Ferramenta de afiliado (parâmetro matt_tool do link).
    mattTool?: string;
  };
  // Identificador de afiliado (parâmetro matt_word do link).
  affiliateTag: string;
}

/**
 * Integração com o programa de afiliados de uma fonte, por ambiente
 * (`IBackend.referralSources`). Uma entrada por fonte; as chaves de
 * `credentials` são as que cada programa usa.
 */
export type IReferralSourceIntegration =
  | IShopeeReferralIntegration
  | IAmazonReferralIntegration
  | IMercadoLivreReferralIntegration;
