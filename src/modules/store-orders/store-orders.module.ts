import { EDataType } from "../../enums/form.enum";
import type { IPublicContract } from "../../interfaces/form-contract.interface";
import type { IForm } from "../../interfaces/form.interface";
import type { IList } from "../../interfaces/list.interface";
import type { IModule } from "../../interfaces/project.interface";
import { tr } from "../store-settings/translations";
import { STORE_ORDER_STATUS_LABELS, addressElements, fulfillmentElements, orderElements } from "./store-order.elements";

export const STORE_ORDERS_ENDPOINT = "/store-orders";

export interface IStoreOrdersModuleOptions {
  // Quem cria e lê os pedidos sem login. "trustedCallers" (padrão): só o
  // backend da loja, com o token de serviço de IMarketplace.sellerServiceAuth.
  publicAccess?: IPublicContract["access"];
  allowedOrigins?: string[];
}

const ENTITY = "storeOrders";

// Um pedido por storeOrderId em cada workspace. Fica no contrato interno do
// form, de onde o gerador cria o índice único, e não no público: o reenvio do
// mesmo pedido pela loja é recusado em vez de duplicar.
const UNIQUE_STORE_ORDER = [{ identificator: "storeOrderIdPerWorkspace", fields: ["storeOrderId"] }];

export const getStoreOrderForm = (options: IStoreOrdersModuleOptions = {}): IForm => ({
  componentType: "form",
  id: "storeOrderForm",
  title: tr("Pedido da loja", "Store order", "Pedido de la tienda"),
  icon: "truck",
  guards: "isAuthorized",
  elements: [
    {
      type: "tab",
      id: "storeOrderTabs",
      tabs: [
        { id: "fulfillment", title: tr("Entrega", "Fulfillment", "Entrega"), elements: fulfillmentElements },
        { id: "order", title: tr("Pedido", "Order", "Pedido"), elements: orderElements },
        { id: "address", title: tr("Endereço", "Address", "Dirección"), elements: addressElements },
      ],
    },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_ORDERS_ENDPOINT,
      actions: ["get", "getById", "update"],
      request: { entity: ENTITY, fields: [], uniqueConstraints: UNIQUE_STORE_ORDER },
    },
  ],
  publicContracts: [
    {
      id: "storeOrdersFromStore",
      endpoint: STORE_ORDERS_ENDPOINT,
      actions: ["create", "get", "update"],
      access: options.publicAccess ?? "trustedCallers",
      ...(options.allowedOrigins ? { allowedOrigins: options.allowedOrigins } : {}),
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

export const getStoreOrderList = (): IList => ({
  componentType: "list",
  id: "storeOrderList",
  title: tr("Pedidos da loja", "Store orders", "Pedidos de la tienda"),
  guards: ["isAuthorized"],
  dataSource: { endpoint: STORE_ORDERS_ENDPOINT, paramType: "query", hasAuthentication: true },
  listItems: [
    { property: "storeOrderId", type: "title", label: tr("Pedido", "Order", "Pedido"), dataType: EDataType.TEXT },
    { property: "customerName", type: "subtitle", label: tr("Cliente", "Customer", "Cliente"), dataType: EDataType.TEXT },
    { property: "total", type: "description", label: tr("Total", "Total", "Total"), dataType: EDataType.CURRENCY },
    { property: "status", type: "badge", label: tr("Andamento", "Status", "Estado"), dataType: EDataType.TEXT },
    { property: "createdAt", label: tr("Recebido em", "Received at", "Recibido el"), dataType: EDataType.DATE, isTimestamp: true },
  ],
  listFilters: [
    {
      type: "select",
      name: "status",
      dataType: EDataType.TEXT,
      label: tr("Andamento", "Status", "Estado"),
      options: (Object.keys(STORE_ORDER_STATUS_LABELS) as (keyof typeof STORE_ORDER_STATUS_LABELS)[]).map((status) => ({
        label: STORE_ORDER_STATUS_LABELS[status],
        value: status,
      })),
    },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_ORDERS_ENDPOINT,
      actions: ["get", "getById", "update"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

/**
 * Módulo pronto "Pedidos da loja", para o Backoffice do vendedor. A loja cria
 * aqui cada pedido aprovado (IStoreOrder) por IMarketplace.storeOrdersEndpoint
 * (STORE_ORDERS_ENDPOINT) e lê o andamento da entrega; o vendedor atualiza
 * status e rastreio.
 */
export const getStoreOrdersModule = (options: IStoreOrdersModuleOptions = {}): IModule => ({
  id: "storeOrdersModule",
  title: tr("Pedidos da loja", "Store orders", "Pedidos de la tienda"),
  icon: "truck",
  components: [getStoreOrderList(), getStoreOrderForm(options)],
});
