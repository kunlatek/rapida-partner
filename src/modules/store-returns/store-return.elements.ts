import { EDataType } from "../../enums/form.enum";
import type { IFormElement } from "../../interfaces/form.interface";
import type { TStoreReturnReason, TStoreReturnStatus, TStoreReturnType } from "../../interfaces/store-return.interface";
import { tr } from "../store-settings/translations";

type TLabel = ReturnType<typeof tr>;

const readOnly = (name: string, label: TLabel, dataType: EDataType.TEXT | EDataType.INTEGER = EDataType.TEXT): IFormElement => ({
  type: "input",
  name,
  dataType,
  label,
  isDisabled: true,
});

const options = <T extends string>(labels: Record<T, TLabel>, selected?: T) =>
  (Object.keys(labels) as T[]).map((value: T) => ({ label: labels[value], value, ...(value === selected ? { isSelected: true } : {}) }));

export const STORE_RETURN_STATUS_LABELS: Record<TStoreReturnStatus, TLabel> = {
  requested: tr("Solicitado", "Requested", "Solicitado"),
  approved: tr("Aprovado", "Approved", "Aprobado"),
  rejected: tr("Recusado", "Rejected", "Rechazado"),
  received: tr("Produto recebido", "Item received", "Producto recibido"),
  completed: tr("Concluído", "Completed", "Concluido"),
};

export const STORE_RETURN_TYPE_LABELS: Record<TStoreReturnType, TLabel> = {
  return: tr("Devolução", "Return", "Devolución"),
  exchange: tr("Troca", "Exchange", "Cambio"),
};

export const STORE_RETURN_REASON_LABELS: Record<TStoreReturnReason, TLabel> = {
  defect: tr("Produto com defeito", "Defective item", "Producto defectuoso"),
  wrongItem: tr("Produto errado", "Wrong item", "Producto equivocado"),
  notAsDescribed: tr("Diferente do anunciado", "Not as described", "Distinto de lo anunciado"),
  regret: tr("Desistência", "Changed my mind", "Desistimiento"),
  other: tr("Outro", "Other", "Otro"),
};

export const resolutionElements: IFormElement[] = [
  {
    type: "select",
    name: "status",
    dataType: EDataType.TEXT,
    label: tr("Andamento", "Status", "Estado"),
    isRequired: true,
    options: options(STORE_RETURN_STATUS_LABELS, "requested"),
  },
  { type: "input", name: "resolutionNotes", dataType: EDataType.TEXT, label: tr("Resposta ao cliente", "Reply to the customer", "Respuesta al cliente") },
  { type: "input", name: "returnTrackingCode", dataType: EDataType.TEXT, label: tr("Código de postagem", "Return tracking code", "Código de envío") },
];

export const requestElements: IFormElement[] = [
  readOnly("storeOrderId", tr("Pedido na loja", "Store order", "Pedido en la tienda")),
  { type: "select", name: "type", dataType: EDataType.TEXT, label: tr("Tipo", "Type", "Tipo"), isRequired: true, isDisabled: true, options: options(STORE_RETURN_TYPE_LABELS) },
  { type: "select", name: "reason", dataType: EDataType.TEXT, label: tr("Motivo", "Reason", "Motivo"), isRequired: true, isDisabled: true, options: options(STORE_RETURN_REASON_LABELS) },
  readOnly("comment", tr("Comentário do cliente", "Customer comment", "Comentario del cliente")),
  readOnly("customerName", tr("Cliente", "Customer", "Cliente")),
  readOnly("customerEmail", tr("E-mail do cliente", "Customer e-mail", "Correo del cliente")),
  {
    type: "array",
    name: "items",
    label: tr("Itens", "Items", "Artículos"),
    elements: [
      readOnly("productId", tr("Produto (id)", "Product (id)", "Producto (id)")),
      readOnly("name", tr("Produto", "Product", "Producto")),
      readOnly("quantity", tr("Quantidade", "Quantity", "Cantidad"), EDataType.INTEGER),
    ],
  },
];
