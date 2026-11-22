/**
 * Andamento da entrega de um pedido no vendedor. O pagamento continua sendo da
 * loja; separação, envio e rastreio são do vendedor (módulo de rapida-projects
 * getStoreOrdersModule).
 */
export type TStoreOrderFulfillmentStatus = "received" | "preparing" | "shipped" | "delivered" | "cancelled";

export interface IStoreOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Pedido aprovado que a loja envia ao vendedor por IMarketplace.storeOrdersEndpoint.
 * Os campos são os nomes do form do módulo de rapida-projects.
 */
export interface IStoreOrder {
  // Id do pedido na loja; um pedido por storeOrderId.
  storeOrderId: string;
  storeName?: string;
  customerName?: string;
  customerEmail?: string;
  items: IStoreOrderItem[];
  // Endereço de entrega, em campos próprios (os forms não aninham objetos).
  addressZipCode?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressState?: string;
  addressCountry?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  status: TStoreOrderFulfillmentStatus;
  trackingCode?: string;
  trackingUrl?: string;
  notes?: string;
}
