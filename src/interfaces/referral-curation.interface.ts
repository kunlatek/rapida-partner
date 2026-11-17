import type { TReferralSource } from "./referral-source.interface";

/**
 * Critério de desempate quando o mesmo produto (mesmo GTIN/EAN) passa pelos
 * filtros em mais de uma fonte. Aplicados na ordem da lista; uma fonte sem o
 * dado do critério (prazo ou comissão) perde aquele desempate.
 *
 * Hoje nenhuma API de afiliado informa prazo de entrega por item: "fastestDelivery"
 * só decide quando a fonte declara `IReferralSourceIntegration.defaultDeliveryDays`.
 */
export type TReferralTieBreaker = "fastestDelivery" | "highestCommission" | "lowestPrice";

/**
 * Filtros de `IReferralCuration` cujo dado nem toda fonte informa:
 * - "ratingCount": `minRatingCount`;
 * - "rating": `minNormalizedRating`;
 * - "freeShipping": `freeShippingOnly`.
 * O desconto sobre o preço médio fica fora: sem histórico não há o que comparar.
 */
export type TReferralCriterion = "ratingCount" | "rating" | "freeShipping";

/**
 * O que fazer com um anúncio quando a fonte não informa o dado de um critério:
 * - "reject": reprova o anúncio (padrão);
 * - "skip": ignora só esse critério para o anúncio, que a vitrine marca como
 *   não verificado nesse ponto.
 */
export type TReferralMissingDataPolicy = "reject" | "skip";

export type TReferralMissingDataRules = Partial<Record<TReferralCriterion, TReferralMissingDataPolicy>>;

/**
 * Exceção de uma fonte às regras de dado ausente. Vale só para os critérios
 * listados; os demais seguem `IReferralCuration.missingData`.
 */
export interface IReferralSourceCurationOverride {
  missingData?: TReferralMissingDataRules;
}

/**
 * O que buscar nas fontes. O job de captura pesquisa cada termo em cada fonte
 * configurada, restrito às categorias da fonte quando declaradas.
 */
export interface IReferralSearch {
  // Termos de busca (ex.: "blu-ray", "box dvd"). Ao menos um.
  keywords: string[];
  // Ids nativos de categoria de cada fonte, para restringir a busca.
  categories?: Partial<Record<TReferralSource, string[]>>;
  // Máximo de anúncios lidos por termo em cada fonte. Padrão do gerador se omitido.
  maxListingsPerQuery?: number;
}

/**
 * Base do "preço médio" com que o preço atual é comparado.
 *
 * "sourceHistory": média dos preços do próprio anúncio, na mesma fonte, nos
 * últimos `windowDays` dias, com um preço por dia (o último capturado no dia).
 * O dia corrente fica fora da média, para o preço de hoje não puxar a base.
 * Os preços vêm do job de captura (`IBackend.scheduledJobs`, id
 * "referralPriceSnapshot"). Enquanto o anúncio tiver menos de `minSnapshots`
 * dias com captura na janela, ele não é exibido.
 */
export interface IReferralPriceBaseline {
  kind: "sourceHistory";
  windowDays: number;
  // Mínimo de dias distintos com captura na janela (não de capturas).
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
  search: IReferralSearch;
  // Política para dado ausente, por critério. Critério omitido = "reject".
  missingData?: TReferralMissingDataRules;
  // Exceções por fonte, que prevalecem sobre `missingData` nos critérios listados.
  sourceOverrides?: Partial<Record<TReferralSource, IReferralSourceCurationOverride>>;
}
