/** Como o cupom desconta: percentual do subtotal ou valor fixo. */
export type TStoreCouponDiscountType = "percentage" | "value";

/**
 * Cupom de desconto cadastrado no Backoffice do vendedor pelo módulo de rapida-projects
 * getStoreCouponsModule e lido pela loja por IMarketplace.couponsEndpoint. A
 * loja valida e desconta no servidor; o uso é contado pelos pedidos da loja.
 * Os campos são os nomes do form do módulo de rapida-projects.
 */
export interface IStoreCoupon {
  // Código digitado pelo cliente; um por workspace, sem diferenciar maiúsculas.
  code: string;
  description?: string;
  discountType: TStoreCouponDiscountType;
  // Percentual (0 a 100) ou valor, conforme discountType.
  discountValue: number;
  // Subtotal mínimo do carrinho para o cupom valer.
  minimumSubtotal?: number;
  // Período de validade (ISO 8601). Sem datas, vale sempre.
  startDate?: string;
  endDate?: string;
  // Usos no total e por cliente, contados nos pedidos aprovados da loja.
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  isActive: boolean;
  // Vitrine de cupons (funcionalidade "couponShowcase"): o cupom aparece na
  // página pública /cupons e pode ir para o aviso da home. Sem o campo, o
  // cupom continua só para quem conhece o código.
  isPublic?: boolean;
}
