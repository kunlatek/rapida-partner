import { EDataType } from "../../enums/form.enum";
import type { IFormElement } from "../../interfaces/form.interface";
import type { TStoreOrderFulfillmentStatus } from "../../interfaces/store-order.interface";
import { tr } from "../store-settings/translations";

type TLabel = ReturnType<typeof tr>;

const text = (name: string, label: TLabel, extra: Partial<{ isRequired: boolean; isDisabled: boolean }> = {}): IFormElement => ({
  type: "input",
  name,
  dataType: EDataType.TEXT,
  label,
  ...extra,
});

const money = (name: string, label: TLabel): IFormElement => ({
  type: "input",
  name,
  dataType: EDataType.CURRENCY,
  label,
  isDisabled: true,
});

export const STORE_ORDER_STATUS_LABELS: Record<TStoreOrderFulfillmentStatus, TLabel> = {
  received: tr("Recebido", "Received", "Recibido"),
  preparing: tr("Em separação", "Preparing", "En preparación"),
  shipped: tr("Enviado", "Shipped", "Enviado"),
  delivered: tr("Entregue", "Delivered", "Entregado"),
  cancelled: tr("Cancelado", "Cancelled", "Cancelado"),
};

export const fulfillmentElements: IFormElement[] = [
  {
    type: "select",
    name: "status",
    dataType: EDataType.TEXT,
    label: tr("Andamento", "Status", "Estado"),
    isRequired: true,
    options: (Object.keys(STORE_ORDER_STATUS_LABELS) as TStoreOrderFulfillmentStatus[]).map((status) => ({
      label: STORE_ORDER_STATUS_LABELS[status],
      value: status,
      isSelected: status === "received",
    })),
  },
  text("trackingCode", tr("Código de rastreio", "Tracking code", "Código de seguimiento")),
  text("trackingUrl", tr("Link de rastreio", "Tracking link", "Enlace de seguimiento")),
  text("notes", tr("Observações", "Notes", "Observaciones")),
];

export const orderElements: IFormElement[] = [
  text("storeOrderId", tr("Pedido na loja", "Store order", "Pedido en la tienda"), { isRequired: true, isDisabled: true }),
  text("storeName", tr("Loja", "Store", "Tienda"), { isDisabled: true }),
  text("customerName", tr("Cliente", "Customer", "Cliente"), { isDisabled: true }),
  text("customerEmail", tr("E-mail do cliente", "Customer e-mail", "Correo del cliente"), { isDisabled: true }),
  {
    type: "array",
    name: "items",
    label: tr("Itens", "Items", "Artículos"),
    elements: [
      text("productId", tr("Produto (id)", "Product (id)", "Producto (id)"), { isRequired: true, isDisabled: true }),
      text("name", tr("Produto", "Product", "Producto"), { isRequired: true, isDisabled: true }),
      { type: "input", name: "quantity", dataType: EDataType.INTEGER, label: tr("Quantidade", "Quantity", "Cantidad"), isRequired: true, isDisabled: true },
      money("unitPrice", tr("Preço unitário", "Unit price", "Precio unitario")),
    ],
  },
  money("subtotal", tr("Subtotal", "Subtotal", "Subtotal")),
  money("discount", tr("Desconto", "Discount", "Descuento")),
  money("shipping", tr("Frete", "Shipping", "Envío")),
  money("total", tr("Total", "Total", "Total")),
  text("currency", tr("Moeda", "Currency", "Moneda"), { isDisabled: true }),
];

export const addressElements: IFormElement[] = [
  text("addressZipCode", tr("CEP", "ZIP code", "Código postal"), { isDisabled: true }),
  text("addressStreet", tr("Logradouro", "Street", "Calle"), { isDisabled: true }),
  text("addressNumber", tr("Número", "Number", "Número"), { isDisabled: true }),
  text("addressComplement", tr("Complemento", "Complement", "Complemento"), { isDisabled: true }),
  text("addressDistrict", tr("Bairro", "District", "Barrio"), { isDisabled: true }),
  text("addressCity", tr("Cidade", "City", "Ciudad"), { isDisabled: true }),
  text("addressState", tr("Estado", "State", "Estado"), { isDisabled: true }),
  text("addressCountry", tr("País", "Country", "País"), { isDisabled: true }),
];
