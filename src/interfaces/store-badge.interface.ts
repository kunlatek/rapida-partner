import type { TTone } from "./tone.interface";

/**
 * Cor do selo: um dos tons de TTone (neutro, verde, âmbar, vermelho) ou
 * "brand", a cor principal da loja. Sem hexadecimal livre, para o texto do
 * selo manter o contraste.
 */
export type TStoreBadgeTone = TTone | "brand";

/**
 * Selo do produto (funcionalidade "productBadges"), como "Novo", "Vegano" ou
 * "Mais vendido". Cadastrado uma vez no Backoffice do vendedor pelo módulo de
 * rapida-projects getStoreBadgesModule e lido pela loja por
 * IMarketplace.badgesEndpoint. Cada produto aponta os selos que mostra em
 * badgeIds da configuração de venda (IProductBadgeLinks). Os campos são os
 * nomes do form do módulo de rapida-projects.
 */
export interface IStoreBadge {
  name: string;
  // Nome de um ícone Lucide (ex.: "sparkles", "leaf"); sem ele, só o texto.
  icon?: string;
  tone: TStoreBadgeTone;
  // Desligado, o selo some de todos os produtos.
  isActive: boolean;
  // Ordem entre os selos do mesmo produto (menor primeiro).
  displayOrder?: number;
}

/**
 * Selos que um produto mostra, no campo badgeIds da configuração de venda do
 * produto (form productSellingSettingForm de rapida-projects, que recebe o
 * campo por withProductBadgesInSellingSettings). Variação sem configuração de
 * venda própria mostra os selos do produto principal.
 */
export interface IProductBadgeLinks {
  badgeIds?: string[];
}
