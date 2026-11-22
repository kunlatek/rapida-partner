/** Moderação da avaliação no vendedor: só as aprovadas aparecem na vitrine. */
export type TStoreReviewStatus = "pending" | "approved" | "rejected";

/**
 * Avaliação de produto enviada pela loja ao vendedor (IMarketplace.reviewsEndpoint,
 * módulo de rapida-projects getStoreReviewsModule). Só cliente com pedido entregue avalia;
 * o vendedor modera e pode responder. Os campos são os nomes do form.
 */
export interface IStoreReview {
  productId: string;
  // Pedido da loja que comprova a compra; uma avaliação por produto e pedido.
  storeOrderId: string;
  customerName: string;
  // Nota de 1 a 5.
  rating: number;
  title?: string;
  comment?: string;
  status: TStoreReviewStatus;
  // Resposta pública do vendedor.
  reply?: string;
}
