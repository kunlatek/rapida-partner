import { describe, expect, test } from "bun:test";
import { storeOnlinePaymentTypeOf } from "./store-order";

describe("storeOnlinePaymentTypeOf", () => {
  test("converte os meios do Mercado Pago", () => {
    expect(storeOnlinePaymentTypeOf("bank_transfer")).toBe("pix");
    expect(storeOnlinePaymentTypeOf("credit_card")).toBe("creditCard");
    expect(storeOnlinePaymentTypeOf("debit_card")).toBe("debitCard");
    expect(storeOnlinePaymentTypeOf("prepaid_card")).toBe("debitCard");
    expect(storeOnlinePaymentTypeOf("ticket")).toBe("boleto");
    expect(storeOnlinePaymentTypeOf("account_money")).toBe("accountMoney");
  });

  test("meio desconhecido vira other, e sem meio fica vazio", () => {
    expect(storeOnlinePaymentTypeOf("atm")).toBe("other");
    expect(storeOnlinePaymentTypeOf(undefined)).toBeUndefined();
    expect(storeOnlinePaymentTypeOf("")).toBeUndefined();
  });
});
