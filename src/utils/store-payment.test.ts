import { describe, expect, test } from "bun:test";
import { isStorePaymentChoiceAllowed, storeDeliveryPaymentChoicesOf, storePaymentChoicesOf } from "./store-payment";

describe("storePaymentChoicesOf", () => {
  test("mostra só as formas ligadas, na ordem do balcão", () => {
    expect(storePaymentChoicesOf({ paymentChoices: ["creditCard", "cash"], pixKey: "chave" })).toEqual(["cash", "creditCard"]);
  });

  test("sem lista, nenhuma forma detalhada aparece", () => {
    expect(storePaymentChoicesOf({})).toEqual([]);
    expect(storePaymentChoicesOf({ paymentChoices: [] })).toEqual([]);
  });

  test("Pix direto some sem chave da loja, mesmo ligado", () => {
    expect(storePaymentChoicesOf({ paymentChoices: ["pixDirect", "debitCard"] })).toEqual(["debitCard"]);
    expect(storePaymentChoicesOf({ paymentChoices: ["pixDirect"], pixKey: "   " })).toEqual([]);
    expect(storePaymentChoicesOf({ paymentChoices: ["pixDirect"], pixKey: "11999999999" })).toEqual(["pixDirect"]);
  });

  test("repetição na lista não duplica a forma", () => {
    expect(storePaymentChoicesOf({ paymentChoices: ["cash", "cash"] })).toEqual(["cash"]);
  });
});

describe("storeDeliveryPaymentChoicesOf", () => {
  test("só as formas da entrega, na ordem do checkout; Pix direto nunca entra", () => {
    expect(storeDeliveryPaymentChoicesOf({ deliveryPaymentChoices: ["cash", "debitCard"] })).toEqual(["debitCard", "cash"]);
    expect(storeDeliveryPaymentChoicesOf({ deliveryPaymentChoices: ["pixDirect" as never] })).toEqual([]);
    expect(storeDeliveryPaymentChoicesOf({})).toEqual([]);
  });
});

describe("isStorePaymentChoiceAllowed", () => {
  test("aceita só forma ligada e com destino", () => {
    const settings = { paymentChoices: ["pixTerminal" as const, "pixDirect" as const] };
    expect(isStorePaymentChoiceAllowed("pixTerminal", settings)).toBe(true);
    expect(isStorePaymentChoiceAllowed("pixDirect", settings)).toBe(false);
    expect(isStorePaymentChoiceAllowed("cash", settings)).toBe(false);
  });
});
