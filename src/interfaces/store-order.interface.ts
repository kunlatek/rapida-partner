import type { TStoreOptionGroupKind } from "./store-option.interface";

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
 * Forma de pagamento detalhada escolhida no pedido (balcão, mesa ou checkout).
 * Só aparecem as formas que o cliente ligou em IStoreSettings.paymentChoices.
 * - "debitCard" e "creditCard": na maquininha.
 * - "pixTerminal": Pix na maquininha (com taxa e prazo D+0).
 * - "pixDirect": Pix direto para a chave da loja (IStoreSettings.pixKey), sem taxa.
 * - "cash": dinheiro, com troco em changeFor.
 */
export type TStorePaymentChoice = "debitCard" | "creditCard" | "pixTerminal" | "pixDirect" | "cash";

/**
 * Destino do pedido na mesa: comer no local ou levar para casa. Obrigatório
 * no checkout da mesa; sem ele o pedido não é confirmado.
 */
export type TStoreConsumptionMode = "dineIn" | "takeaway";

/**
 * Meio do pagamento online, informado pelo Mercado Pago (Fase 8.1), para o
 * vendedor ver "Pago no Pix" ou "Pago no cartão". Veja storeOnlinePaymentTypeOf.
 */
export type TStoreOnlinePaymentType = "pix" | "creditCard" | "debitCard" | "boleto" | "accountMoney" | "other";

/**
 * Escolha do cliente numa linha do pedido (ex.: grupo "Ponto da carne", opção
 * "Mal passado"). Com a funcionalidade "productOptions", vem de IStoreOption.
 */
export interface IStoreOrderItemSelection {
  group: string;
  option: string;
  // Quanto esta escolha muda o preço unitário, em reais, por unidade escolhida:
  // positivo é acréscimo, negativo é desconto (ex.: meia-entrada); 0 ou vazio quando não muda.
  priceDelta?: number;
  // Id da opção (IStoreOption) e quantas vezes foi escolhida (padrão 1).
  optionId?: string;
  quantity?: number;
  // Tipo do grupo (IStoreOptionGroup.kind); o quadro do vendedor pinta a etiqueta por ele.
  kind?: TStoreOptionGroupKind;
}

/**
 * Escolha de uma linha do pedido como o vendedor recebe (Fase 8.1). Os forms
 * do vendedor não guardam lista dentro de lista, então as escolhas de todas as
 * linhas vêm numa lista só do pedido, com itemIndex (posição em items, a partir de 0).
 */
export interface IStoreOrderSelectionLine {
  itemIndex: number;
  group: string;
  option: string;
  kind?: TStoreOptionGroupKind;
  quantity?: number;
}

/** Titular de um ingresso (events) ou participante de um passeio (services), Fase 5.3. */
export interface IStoreOrderAttendee {
  name: string;
  // CPF, só dígitos: obrigatório em events e, em services, na meia-entrada.
  document?: string;
}

/**
 * Ingresso ou voucher (Fase 5.4): um por titular (ou por unidade, sem
 * titulares), emitido quando o pagamento é aprovado. code é assinado pela loja
 * (não é o id do pedido) e vai no QR; usedAt marca a entrada (Fase 5.5).
 */
export interface IStoreTicket {
  code: string;
  productId: string;
  name: string;
  attendeeName?: string;
  halfPrice?: boolean;
  usedAt?: string;
  // Quem conferiu a entrada.
  usedBy?: string;
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
  // Titulares ou participantes em texto para o vendedor (ex.: "Ana Souza (CPF 123.456.789-09); Bruno Lima").
  attendeesSummary?: string;
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
  // Telefone do cliente, só dígitos com DDD (Fase 8.1), para o WhatsApp do pedido.
  customerPhone?: string;
  items: IStoreOrderItem[];
  // Fidelidade (funcionalidade "loyalty", Fase 7.3): nível do cliente no
  // fechamento e o desconto que ele deu (já somado em discount).
  loyaltyTierName?: string;
  loyaltyDiscount?: number;
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
  // Forma detalhada escolhida (Pagamentos por pedido, fase 1); vazio em pedidos anteriores.
  paymentChoice?: TStorePaymentChoice;
  // Destino na mesa (fase 1): vazio fora da mesa.
  consumptionMode?: TStoreConsumptionMode;
  changeFor?: number;
  paymentReceived?: boolean;
  // Meio do pagamento online (Fase 8.1); vazio no pagamento na entrega.
  onlinePaymentType?: TStoreOnlinePaymentType;
  // Reserva de estoque (Fase 4.3): pago depois da reserva vencer, ou acima do
  // estoque. O vendedor decide: manter, trocar (ex.: de sessão) ou estornar no
  // painel do Mercado Pago; o estorno cancela o pedido na loja.
  overCapacity?: boolean;
  trackingCode?: string;
  trackingUrl?: string;
  notes?: string;
  // Quando o vendedor abriu ou mexeu no pedido pela primeira vez (Fase 8.1); sem ele, o quadro mostra "NOVO".
  seenAt?: string;
  // Escolhas de cada linha, para as etiquetas do quadro (Fase 8.1); selectionsSummary continua em cada item.
  itemSelections?: IStoreOrderSelectionLine[];
  // Ingressos do pedido (Fase 5.4), enviados pela loja; a conferência na entrada (5.5) marca usedAt.
  tickets?: IStoreTicket[];
}
