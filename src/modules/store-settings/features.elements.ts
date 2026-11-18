import { EDataType } from "../../enums/form.enum";
import type { IFormElement } from "../../interfaces/form.interface";
import type { TStoreFeature } from "../../interfaces/store-settings.interface";
import { tr } from "./translations";

const FEATURE_LABELS: Record<TStoreFeature, ReturnType<typeof tr>> = {
  whatsappButton: tr("Mostrar botão de WhatsApp", "Show WhatsApp button", "Mostrar botón de WhatsApp"),
  stockAvailability: tr("Mostrar \"esgotado\" e filtro \"só em estoque\"", "Show \"sold out\" and \"in stock only\" filter", "Mostrar \"agotado\" y filtro \"solo en stock\""),
  cashDiscount: tr("Anunciar desconto à vista", "Show cash discount", "Anunciar descuento al contado"),
  installments: tr("Anunciar parcelas sem juros", "Show interest-free installments", "Anunciar cuotas sin interés"),
  favorites: tr("Favoritos", "Favorites", "Favoritos"),
  blog: tr("Blog", "Blog", "Blog"),
  shipping: tr("Cobrar frete por faixa de CEP", "Charge shipping by ZIP code range", "Cobrar envío por rango de código postal"),
  coupons: tr("Aceitar cupons de desconto", "Accept discount coupons", "Aceptar cupones de descuento"),
  reviews: tr("Avaliações de produtos", "Product reviews", "Reseñas de productos"),
  returns: tr("Pedidos de devolução e troca", "Return and exchange requests", "Solicitudes de devolución y cambio"),
};

const shippingElements: IFormElement[] = [
  {
    type: "input",
    name: "originZipCode",
    dataType: EDataType.TEXT,
    label: tr("CEP de origem", "Origin ZIP code", "Código postal de origen"),
    tooltip: tr("Somente dígitos (ex.: 57035000)", "Digits only (e.g. 57035000)", "Solo dígitos (ej.: 57035000)"),
    validators: ["onlyNumbers"],
  },
  {
    type: "input",
    name: "freeShippingAbove",
    dataType: EDataType.CURRENCY,
    label: tr("Frete grátis acima de", "Free shipping above", "Envío gratis a partir de"),
  },
  {
    type: "array",
    name: "shippingRanges",
    label: tr("Faixas de CEP", "ZIP code ranges", "Rangos de código postal"),
    elements: [
      { type: "input", name: "label", dataType: EDataType.TEXT, label: tr("Nome da faixa", "Range name", "Nombre del rango") },
      { type: "input", name: "zipCodeStart", dataType: EDataType.TEXT, label: tr("CEP inicial", "First ZIP code", "Código postal inicial"), isRequired: true, validators: ["onlyNumbers"] },
      { type: "input", name: "zipCodeEnd", dataType: EDataType.TEXT, label: tr("CEP final", "Last ZIP code", "Código postal final"), isRequired: true, validators: ["onlyNumbers"] },
      { type: "input", name: "price", dataType: EDataType.CURRENCY, label: tr("Valor do frete", "Shipping price", "Precio del envío"), isRequired: true },
      { type: "input", name: "deliveryDays", dataType: EDataType.INTEGER, label: tr("Prazo (dias úteis)", "Delivery time (business days)", "Plazo (días hábiles)"), isRequired: true },
    ],
  },
];

const featureDetails = (feature: TStoreFeature): IFormElement[] => {
  if (feature === "cashDiscount") {
    return [
      {
        type: "input",
        name: "cashDiscountPercent",
        dataType: EDataType.NUMBER,
        label: tr("Desconto à vista (%)", "Cash discount (%)", "Descuento al contado (%)"),
        suffix: "%",
      },
    ];
  }
  if (feature === "installments") {
    return [
      {
        type: "input",
        name: "maxInstallments",
        dataType: EDataType.INTEGER,
        label: tr("Parcelas sem juros (máximo)", "Interest-free installments (max)", "Cuotas sin interés (máximo)"),
      },
    ];
  }
  if (feature === "shipping") return shippingElements;
  if (feature === "returns") {
    return [
      {
        type: "input",
        name: "returnWindowDays",
        dataType: EDataType.INTEGER,
        label: tr("Prazo para pedir (dias após a entrega)", "Request window (days after delivery)", "Plazo para solicitar (días tras la entrega)"),
      },
    ];
  }
  return [];
};

/** Liga e desliga só das funcionalidades que a loja gera, cada um seguido dos seus campos. */
export const getFeatureElements = (features: TStoreFeature[]): IFormElement[] =>
  features.flatMap((feature: TStoreFeature): IFormElement[] => [
    {
      type: "switch",
      name: `${feature}Enabled`,
      label: FEATURE_LABELS[feature],
    },
    ...featureDetails(feature),
  ]);
