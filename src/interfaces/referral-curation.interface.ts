/**
 * Critério de desempate quando o mesmo produto (mesmo GTIN/EAN) passa pelos
 * filtros em mais de uma fonte. Aplicados na ordem da lista; uma fonte sem o
 * dado do critério (prazo ou comissão) perde aquele desempate.
 */
export type TReferralTieBreaker = "fastestDelivery" | "highestCommission" | "lowestPrice";

/**
 * Base do "preço médio" com que o preço atual é comparado.
 *
 * "sourceHistory": média simples dos preços do próprio anúncio, na mesma fonte,
 * capturados nos últimos `windowDays` dias pelo job de captura de preços
 * (`IBackend.scheduledJobs`, id "referralPriceSnapshot"). Enquanto o anúncio
 * tiver menos de `minSnapshots` capturas na janela, ele não é exibido.
 */
export interface IReferralPriceBaseline {
  kind: "sourceHistory";
  windowDays: number;
  minSnapshots?: number;
}

/**
 * Regras de curadoria dos produtos exibidos no skeleton "referralCommerce"
 * (`IProject.referralCuration`). São regras do produto, iguais em todo ambiente;
 * credenciais das fontes ficam em `IBackend.referralSources`.
 *
 * Identidade de produto entre fontes: só GTIN/EAN normalizado (forma GTIN-14,
 * dígito verificador válido). Anúncio sem GTIN válido não é descartado: concorre
 * sozinho, sem entrar no desempate com as outras fontes.
 */
export interface IReferralCuration {
  // Mínimo de avaliações, inclusivo (">200 avaliações" = 201).
  minRatingCount: number;
  // Nota mínima normalizada em 0..1, inclusiva: 0.9 = 4.5/5 = 9/10.
  minNormalizedRating: number;
  // Desconto mínimo (0..1) do preço atual em relação a `priceBaseline`: 0.1 = 10% abaixo.
  minDiscountFromBaseline: number;
  priceBaseline: IReferralPriceBaseline;
  // Só exibe anúncios com frete grátis.
  freeShippingOnly: boolean;
  tieBreakers: TReferralTieBreaker[];
}
