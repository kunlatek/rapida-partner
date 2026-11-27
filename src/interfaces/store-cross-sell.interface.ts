/**
 * Oferta ao adicionar (funcionalidade "crossSell"): outro produto com preço
 * especial levando este, como "Batata frita por R$ 5,00 levando este lanche".
 * Fica no campo crossSellOffers da configuração de venda do produto de origem
 * (form productSellingSettingForm de rapida-projects, que recebe a lista por
 * withCrossSellInSellingSettings). Ao adicionar o produto de origem, a loja
 * mostra as ofertas; a oferta aceita é outra linha do carrinho.
 *
 * O servidor só aplica offerPrice até a quantidade do produto de origem no
 * mesmo pedido; o que passar sai pelo preço normal. O produto ofertado é
 * simples (sem variações nem adicionais); com variação, aponte o filho.
 */
export interface IProductCrossSellOffer {
  offerProductId: string;
  // Preço especial por unidade; só vale se for menor que o preço normal.
  offerPrice: number;
}

export interface IProductCrossSellLinks {
  crossSellOffers?: IProductCrossSellOffer[];
}
