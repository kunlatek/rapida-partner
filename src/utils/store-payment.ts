import type { TStoreConsumptionMode, TStorePaymentChoice } from "../interfaces/store-order.interface";
import type { IStoreSettings } from "../interfaces/store-settings.interface";

/** Formas detalhadas de pagamento, na ordem em que aparecem no balcão e no checkout. */
export const STORE_PAYMENT_CHOICES: TStorePaymentChoice[] = ["cash", "debitCard", "creditCard", "pixTerminal", "pixDirect"];

/** Formas que existem na entrega (maquininha e dinheiro), na ordem do checkout. Pix direto não entra. */
export const STORE_DELIVERY_PAYMENT_CHOICES: TStorePaymentChoice[] = ["debitCard", "creditCard", "pixTerminal", "cash"];

/** Destinos do pedido na mesa, na ordem do checkout. */
export const STORE_CONSUMPTION_MODES: TStoreConsumptionMode[] = ["dineIn", "takeaway"];

/**
 * Formas que a loja aceita de fato: só as ligadas em paymentChoices, sem repetição
 * e na ordem de STORE_PAYMENT_CHOICES. "pixDirect" só entra com pixKey preenchida,
 * para a loja nunca mostrar um Pix sem destino.
 */
export const storePaymentChoicesOf = (settings: Pick<IStoreSettings, "paymentChoices" | "pixKey">): TStorePaymentChoice[] => {
  const enabled = new Set(settings.paymentChoices ?? []);
  const hasPixKey = (settings.pixKey ?? "").trim().length > 0;
  return STORE_PAYMENT_CHOICES.filter((choice) => enabled.has(choice) && (choice !== "pixDirect" || hasPixKey));
};

/**
 * Formas da entrega que a loja liga (deliveryPaymentChoices), sem repetição e na ordem do checkout.
 * Pix direto nunca entra: a entrega só aceita maquininha e dinheiro.
 */
export const storeDeliveryPaymentChoicesOf = (settings: Pick<IStoreSettings, "deliveryPaymentChoices">): TStorePaymentChoice[] => {
  const enabled = new Set(settings.deliveryPaymentChoices ?? []);
  return STORE_DELIVERY_PAYMENT_CHOICES.filter((choice) => enabled.has(choice));
};

/** Vale gravar a forma no pedido: ela precisa estar entre as formas aceitas pela loja. */
export const isStorePaymentChoiceAllowed = (
  choice: TStorePaymentChoice,
  settings: Pick<IStoreSettings, "paymentChoices" | "pixKey">,
): boolean => storePaymentChoicesOf(settings).includes(choice);
