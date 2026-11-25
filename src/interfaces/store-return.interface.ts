/**
 * O que o cliente pede: devolver (reembolso) ou trocar; em events e services,
 * cancelar o ingresso ou o passeio antes da sessão (Fase 5.6).
 */
export type TStoreReturnType = "return" | "exchange" | "cancellation";

export type TStoreReturnReason = "defect" | "wrongItem" | "notAsDescribed" | "regret" | "cantAttend" | "scheduleChange" | "other";

/** Andamento do pedido de devolução ou troca no vendedor. */
export type TStoreReturnStatus = "requested" | "approved" | "rejected" | "received" | "completed";

export interface IStoreReturnItem {
  productId: string;
  name: string;
  quantity: number;
}

/**
 * Pedido de devolução ou troca aberto pelo cliente em Minha conta e enviado
 * pela loja ao vendedor (IMarketplace.returnsEndpoint, módulo de rapida-projects
 * getStoreReturnsModule). O vendedor aprova ou recusa e acompanha o retorno;
 * o reembolso continua sendo da loja (estorno no gateway). Os campos são os
 * nomes do form.
 */
export interface IStoreReturnRequest {
  storeOrderId: string;
  customerName?: string;
  customerEmail?: string;
  type: TStoreReturnType;
  reason: TStoreReturnReason;
  items: IStoreReturnItem[];
  comment?: string;
  status: TStoreReturnStatus;
  // Resposta do vendedor ao cliente (instruções de envio, motivo da recusa).
  resolutionNotes?: string;
  // Código de postagem do produto devolvido.
  returnTrackingCode?: string;
}
