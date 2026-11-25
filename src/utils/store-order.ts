import type { TStoreOptionGroupKind } from "../interfaces/store-option.interface";
import type { TStoreOnlinePaymentType } from "../interfaces/store-order.interface";

/** Tamanho máximo da observação do cliente numa linha do pedido (funcionalidade "itemNotes"). */
export const STORE_ITEM_NOTE_MAX_LENGTH = 140;

/** Máximo que IStoreOption.maxQuantity aceita (quantas vezes a mesma opção entra numa linha). */
export const STORE_OPTION_MAX_QUANTITY = 10;

/** Tipos de grupo de opções (IStoreOptionGroup.kind); o primeiro é o padrão. */
export const STORE_OPTION_GROUP_KINDS: TStoreOptionGroupKind[] = ["option", "remove", "preparation", "addon"];

/** payment_type_id do Mercado Pago → meio que o vendedor vê; o que não está aqui vira "other". */
export const STORE_MERCADO_PAGO_PAYMENT_TYPES: Record<string, TStoreOnlinePaymentType> = {
  bank_transfer: "pix",
  credit_card: "creditCard",
  debit_card: "debitCard",
  prepaid_card: "debitCard",
  ticket: "boleto",
  account_money: "accountMoney",
};

/** Converte o payment_type_id do Mercado Pago no meio de pagamento que o vendedor vê (Fase 8.1). */
export const storeOnlinePaymentTypeOf = (mercadoPagoPaymentType: string | undefined): TStoreOnlinePaymentType | undefined => {
  if (!mercadoPagoPaymentType) return undefined;
  return STORE_MERCADO_PAGO_PAYMENT_TYPES[mercadoPagoPaymentType] ?? "other";
};
