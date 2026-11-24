/**
 * Andamento da entrega de um pedido no vendedor. O pagamento continua sendo da
 * loja; separação, envio e rastreio são do vendedor (módulo de rapida-projects
 * getStoreOrdersModule).
 */
export type TStoreOrderFulfillmentStatus = "received" | "preparing" | "shipped" | "delivered" | "cancelled";

/** Como o cliente recebe o pedido: entrega no endereço ou retirada na loja. */
export type TStoreDeliveryMethod = "delivery" | "pickup";

/** Como o cliente paga: online (Mercado Pago) ou na entrega/retirada. */
export type TStorePaymentMethod = "online" | "onDelivery";

/**
 * Escolha do cliente numa linha do pedido (ex.: grupo "Ponto da carne", opção
 * "Mal passado"). Com a funcionalidade "productOptions", vem de IStoreOption.
 */
export interface IStoreOrderItemSelection {
  group: string;
  option: string;
  // Acréscimo no preço unitário por unidade desta escolha; 0 ou vazio quando não muda.
  priceDelta?: number;
  // Id da opção (IStoreOption) e quantas vezes foi escolhida (padrão 1).
  optionId?: string;
  quantity?: number;
}

export interface IStoreOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  // Escolhas e observação do cliente nesta linha. Duas linhas do mesmo produto
  // com escolhas ou observação diferentes são linhas separadas.
  selections?: IStoreOrderItemSelection[];
  // Observação do cliente (funcionalidade "itemNotes"), até STORE_ITEM_NOTE_MAX_LENGTH caracteres.
  note?: string;
  // Escolhas em texto para o vendedor (ex.: "Adicionais: Bacon ×2, Queijo").
  selectionsSummary?: string;
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
  // Padrão "delivery". Na retirada não há endereço, e "shipped" quer dizer
  // pronto para retirar.
  deliveryMethod?: TStoreDeliveryMethod;
  // Bairro escolhido na entrega por bairro (funcionalidade "districtDelivery").
  deliveryDistrict?: string;
  // Padrão "online". Com "onDelivery", o pedido chega confirmado e sem
  // pagamento: changeFor é o valor para o troco, e o vendedor marca
  // paymentReceived quando receber.
  paymentMethod?: TStorePaymentMethod;
  changeFor?: number;
  paymentReceived?: boolean;
  trackingCode?: string;
  trackingUrl?: string;
  notes?: string;
}
