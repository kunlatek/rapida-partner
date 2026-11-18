import { EDataType } from "../../enums/form.enum";
import type { IPublicContract } from "../../interfaces/form-contract.interface";
import type { IForm, IFormElement } from "../../interfaces/form.interface";
import type { IList } from "../../interfaces/list.interface";
import type { IModule } from "../../interfaces/project.interface";
import type { TStoreCouponDiscountType } from "../../interfaces/store-coupon.interface";
import { tr } from "../store-settings/translations";

export const STORE_COUPONS_ENDPOINT = "/store-coupons";

export interface IStoreCouponsModuleOptions {
  // Quem lê os cupons sem login. "trustedCallers" (padrão): só o backend da
  // loja, com o token de serviço de IMarketplace.sellerServiceAuth.
  publicAccess?: IPublicContract["access"];
  allowedOrigins?: string[];
}

const ENTITY = "storeCoupons";

const DISCOUNT_TYPE_LABELS: Record<TStoreCouponDiscountType, ReturnType<typeof tr>> = {
  percentage: tr("Percentual (%)", "Percentage (%)", "Porcentaje (%)"),
  value: tr("Valor fixo", "Fixed amount", "Monto fijo"),
};

const couponElements: IFormElement[] = [
  {
    type: "input",
    name: "code",
    dataType: EDataType.TEXT,
    label: tr("Código", "Code", "Código"),
    tooltip: tr("O que o cliente digita no carrinho (ex.: BEMVINDO10)", "What the customer types in the cart (e.g. WELCOME10)", "Lo que el cliente escribe en el carrito (ej.: BIENVENIDO10)"),
    isRequired: true,
    isUnique: true,
    space: 2,
  },
  { type: "input", name: "description", dataType: EDataType.TEXT, label: tr("Descrição", "Description", "Descripción"), space: 2 },
  {
    type: "select",
    name: "discountType",
    dataType: EDataType.TEXT,
    label: tr("Tipo de desconto", "Discount type", "Tipo de descuento"),
    isRequired: true,
    options: (Object.keys(DISCOUNT_TYPE_LABELS) as TStoreCouponDiscountType[]).map((value) => ({
      label: DISCOUNT_TYPE_LABELS[value],
      value,
      isSelected: value === "percentage",
    })),
    space: 2,
  },
  { type: "input", name: "discountValue", dataType: EDataType.NUMBER, label: tr("Desconto", "Discount", "Descuento"), isRequired: true, space: 2 },
  { type: "input", name: "minimumSubtotal", dataType: EDataType.CURRENCY, label: tr("Pedido mínimo", "Minimum order", "Pedido mínimo"), space: 2 },
  { type: "datepicker", name: "startDate", label: tr("Válido a partir de", "Valid from", "Válido desde") },
  { type: "datepicker", name: "endDate", label: tr("Válido até", "Valid until", "Válido hasta") },
  { type: "input", name: "usageLimit", dataType: EDataType.INTEGER, label: tr("Limite de usos", "Usage limit", "Límite de usos"), space: 2 },
  {
    type: "input",
    name: "usageLimitPerCustomer",
    dataType: EDataType.INTEGER,
    label: tr("Limite por cliente", "Limit per customer", "Límite por cliente"),
    space: 2,
  },
  { type: "switch", name: "isActive", label: tr("Ativo", "Active", "Activo") },
];

// Um código por workspace; fica no contrato interno, de onde o gerador cria o índice único.
const UNIQUE_CODE = [{ identificator: "storeCouponCodePerWorkspace", fields: ["code"] }];

export const getStoreCouponForm = (options: IStoreCouponsModuleOptions = {}): IForm => ({
  componentType: "form",
  id: "storeCouponForm",
  title: tr("Cupom", "Coupon", "Cupón"),
  icon: "ticket-percent",
  guards: "isAuthorized",
  elements: couponElements,
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_COUPONS_ENDPOINT,
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: { entity: ENTITY, fields: [], uniqueConstraints: UNIQUE_CODE },
    },
  ],
  publicContracts: [
    {
      id: "storeCouponsFromStore",
      endpoint: STORE_COUPONS_ENDPOINT,
      actions: ["get"],
      access: options.publicAccess ?? "trustedCallers",
      ...(options.allowedOrigins ? { allowedOrigins: options.allowedOrigins } : {}),
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

export const getStoreCouponList = (): IList => ({
  componentType: "list",
  id: "storeCouponList",
  title: tr("Cupons", "Coupons", "Cupones"),
  guards: ["isAuthorized"],
  dataSource: { endpoint: STORE_COUPONS_ENDPOINT, paramType: "query", hasAuthentication: true },
  listItems: [
    { property: "code", type: "title", label: tr("Código", "Code", "Código"), dataType: EDataType.TEXT },
    { property: "description", type: "subtitle", label: tr("Descrição", "Description", "Descripción"), dataType: EDataType.TEXT },
    { property: "discountValue", type: "description", label: tr("Desconto", "Discount", "Descuento"), dataType: EDataType.NUMBER },
    { property: "endDate", label: tr("Válido até", "Valid until", "Válido hasta"), dataType: EDataType.DATE },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_COUPONS_ENDPOINT,
      actions: ["get", "getById", "update", "softDelete"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

/**
 * Módulo pronto "Cupons", para o Backoffice do vendedor (funcionalidade
 * "coupons"). A loja lê os cupons por IMarketplace.couponsEndpoint
 * (STORE_COUPONS_ENDPOINT), valida o código e desconta no servidor.
 */
export const getStoreCouponsModule = (options: IStoreCouponsModuleOptions = {}): IModule => ({
  id: "storeCouponsModule",
  title: tr("Cupons", "Coupons", "Cupones"),
  icon: "ticket-percent",
  components: [getStoreCouponList(), getStoreCouponForm(options)],
});
