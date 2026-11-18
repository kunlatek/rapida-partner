import { EDataType } from "../../enums/form.enum";
import type { IPublicContract } from "../../interfaces/form-contract.interface";
import type { IForm } from "../../interfaces/form.interface";
import type { IList } from "../../interfaces/list.interface";
import type { IModule } from "../../interfaces/project.interface";
import type { TStoreReturnStatus } from "../../interfaces/store-return.interface";
import { tr } from "../store-settings/translations";
import { STORE_RETURN_STATUS_LABELS, requestElements, resolutionElements } from "./store-return.elements";

export const STORE_RETURNS_ENDPOINT = "/store-returns";

export interface IStoreReturnsModuleOptions {
  publicAccess?: IPublicContract["access"];
  allowedOrigins?: string[];
}

const ENTITY = "storeReturns";

export const getStoreReturnForm = (options: IStoreReturnsModuleOptions = {}): IForm => ({
  componentType: "form",
  id: "storeReturnForm",
  title: tr("Devolução ou troca", "Return or exchange", "Devolución o cambio"),
  icon: "undo-2",
  guards: "isAuthorized",
  elements: [
    {
      type: "tab",
      id: "storeReturnTabs",
      tabs: [
        { id: "resolution", title: tr("Resposta", "Resolution", "Respuesta"), elements: resolutionElements },
        { id: "request", title: tr("Pedido do cliente", "Customer request", "Solicitud del cliente"), elements: requestElements },
      ],
    },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_RETURNS_ENDPOINT,
      actions: ["get", "getById", "update"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
  publicContracts: [
    {
      id: "storeReturnsFromStore",
      endpoint: STORE_RETURNS_ENDPOINT,
      actions: ["create", "get"],
      access: options.publicAccess ?? "trustedCallers",
      ...(options.allowedOrigins ? { allowedOrigins: options.allowedOrigins } : {}),
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

export const getStoreReturnList = (): IList => ({
  componentType: "list",
  id: "storeReturnList",
  title: tr("Devoluções e trocas", "Returns and exchanges", "Devoluciones y cambios"),
  guards: ["isAuthorized"],
  dataSource: { endpoint: STORE_RETURNS_ENDPOINT, paramType: "query", hasAuthentication: true },
  listItems: [
    { property: "storeOrderId", type: "title", label: tr("Pedido", "Order", "Pedido"), dataType: EDataType.TEXT },
    { property: "customerName", type: "subtitle", label: tr("Cliente", "Customer", "Cliente"), dataType: EDataType.TEXT },
    { property: "type", type: "description", label: tr("Tipo", "Type", "Tipo"), dataType: EDataType.TEXT },
    { property: "status", type: "badge", label: tr("Andamento", "Status", "Estado"), dataType: EDataType.TEXT },
    { property: "createdAt", label: tr("Pedido em", "Requested at", "Solicitado el"), dataType: EDataType.DATE, isTimestamp: true },
  ],
  listFilters: [
    {
      type: "select",
      name: "status",
      dataType: EDataType.TEXT,
      label: tr("Andamento", "Status", "Estado"),
      options: (Object.keys(STORE_RETURN_STATUS_LABELS) as TStoreReturnStatus[]).map((status) => ({
        label: STORE_RETURN_STATUS_LABELS[status],
        value: status,
      })),
    },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_RETURNS_ENDPOINT,
      actions: ["get", "getById", "update"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

/**
 * Módulo pronto "Devoluções e trocas", para o Backoffice do vendedor
 * (funcionalidade "returns"). A loja abre aqui o pedido do cliente
 * (IMarketplace.returnsEndpoint) e lê dali o andamento; o vendedor aprova,
 * recusa e acompanha o retorno do produto. O reembolso continua na loja.
 */
export const getStoreReturnsModule = (options: IStoreReturnsModuleOptions = {}): IModule => ({
  id: "storeReturnsModule",
  title: tr("Devoluções e trocas", "Returns and exchanges", "Devoluciones y cambios"),
  icon: "undo-2",
  components: [getStoreReturnList(), getStoreReturnForm(options)],
});
