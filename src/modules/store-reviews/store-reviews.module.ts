import { EDataType } from "../../enums/form.enum";
import type { IPublicContract } from "../../interfaces/form-contract.interface";
import type { IForm, IFormElement } from "../../interfaces/form.interface";
import type { IList } from "../../interfaces/list.interface";
import type { IModule } from "../../interfaces/project.interface";
import type { TStoreReviewStatus } from "../../interfaces/store-review.interface";
import { tr } from "../store-settings/translations";

export const STORE_REVIEWS_ENDPOINT = "/store-reviews";
// Nota média por produto: GET <endpoint>/aggregations/rating (soma de rating e count).
export const STORE_REVIEWS_RATING_AGGREGATION = "rating";

export interface IStoreReviewsModuleOptions {
  publicAccess?: IPublicContract["access"];
  allowedOrigins?: string[];
}

const ENTITY = "storeReviews";

export const STORE_REVIEW_STATUS_LABELS: Record<TStoreReviewStatus, ReturnType<typeof tr>> = {
  pending: tr("Aguardando moderação", "Awaiting moderation", "Esperando moderación"),
  approved: tr("Aprovada", "Approved", "Aprobada"),
  rejected: tr("Recusada", "Rejected", "Rechazada"),
};

const readOnly = (name: string, label: ReturnType<typeof tr>, dataType: EDataType.TEXT | EDataType.INTEGER = EDataType.TEXT): IFormElement => ({
  type: "input",
  name,
  dataType,
  label,
  isDisabled: true,
});

const reviewElements: IFormElement[] = [
  {
    type: "select",
    name: "status",
    dataType: EDataType.TEXT,
    label: tr("Moderação", "Moderation", "Moderación"),
    isRequired: true,
    options: (Object.keys(STORE_REVIEW_STATUS_LABELS) as TStoreReviewStatus[]).map((status) => ({
      label: STORE_REVIEW_STATUS_LABELS[status],
      value: status,
      isSelected: status === "pending",
    })),
  },
  { type: "input", name: "reply", dataType: EDataType.TEXT, label: tr("Resposta do vendedor", "Seller reply", "Respuesta del vendedor") },
  readOnly("rating", tr("Nota (1 a 5)", "Rating (1 to 5)", "Nota (1 a 5)"), EDataType.INTEGER),
  readOnly("title", tr("Título", "Title", "Título")),
  readOnly("comment", tr("Comentário", "Comment", "Comentario")),
  readOnly("customerName", tr("Cliente", "Customer", "Cliente")),
  readOnly("productId", tr("Produto (id)", "Product (id)", "Producto (id)")),
  readOnly("storeOrderId", tr("Pedido na loja", "Store order", "Pedido en la tienda")),
];

// Uma avaliação por produto em cada pedido da loja.
const UNIQUE_REVIEW = [{ identificator: "storeReviewPerOrderProduct", fields: ["storeOrderId", "productId"] }];

export const getStoreReviewForm = (options: IStoreReviewsModuleOptions = {}): IForm => ({
  componentType: "form",
  id: "storeReviewForm",
  title: tr("Avaliação", "Review", "Reseña"),
  icon: "star",
  guards: "isAuthorized",
  elements: reviewElements,
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_REVIEWS_ENDPOINT,
      actions: ["get", "getById", "update", "softDelete"],
      request: { entity: ENTITY, fields: [], uniqueConstraints: UNIQUE_REVIEW },
    },
  ],
  publicContracts: [
    {
      id: "storeReviewsFromStore",
      endpoint: STORE_REVIEWS_ENDPOINT,
      actions: ["create", "get"],
      access: options.publicAccess ?? "trustedCallers",
      ...(options.allowedOrigins ? { allowedOrigins: options.allowedOrigins } : {}),
      aggregations: [{ id: STORE_REVIEWS_RATING_AGGREGATION, groupBy: "productId", sum: ["rating"], count: true }],
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

export const getStoreReviewList = (): IList => ({
  componentType: "list",
  id: "storeReviewList",
  title: tr("Avaliações", "Reviews", "Reseñas"),
  guards: ["isAuthorized"],
  dataSource: { endpoint: STORE_REVIEWS_ENDPOINT, paramType: "query", hasAuthentication: true },
  listItems: [
    { property: "title", type: "title", label: tr("Título", "Title", "Título"), dataType: EDataType.TEXT },
    { property: "customerName", type: "subtitle", label: tr("Cliente", "Customer", "Cliente"), dataType: EDataType.TEXT },
    { property: "rating", type: "description", label: tr("Nota", "Rating", "Nota"), dataType: EDataType.INTEGER },
    { property: "status", type: "badge", label: tr("Moderação", "Moderation", "Moderación"), dataType: EDataType.TEXT },
    { property: "createdAt", label: tr("Recebida em", "Received at", "Recibida el"), dataType: EDataType.DATE, isTimestamp: true },
  ],
  listFilters: [
    {
      type: "select",
      name: "status",
      dataType: EDataType.TEXT,
      label: tr("Moderação", "Moderation", "Moderación"),
      options: (Object.keys(STORE_REVIEW_STATUS_LABELS) as TStoreReviewStatus[]).map((status) => ({
        label: STORE_REVIEW_STATUS_LABELS[status],
        value: status,
      })),
    },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_REVIEWS_ENDPOINT,
      actions: ["get", "getById", "update", "softDelete"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

/**
 * Módulo pronto "Avaliações", para o Backoffice do vendedor (funcionalidade
 * "reviews"). A loja cria aqui a avaliação de quem recebeu o pedido
 * (IMarketplace.reviewsEndpoint) e lê as aprovadas e a nota média.
 */
export const getStoreReviewsModule = (options: IStoreReviewsModuleOptions = {}): IModule => ({
  id: "storeReviewsModule",
  title: tr("Avaliações", "Reviews", "Reseñas"),
  icon: "star",
  components: [getStoreReviewList(), getStoreReviewForm(options)],
});
