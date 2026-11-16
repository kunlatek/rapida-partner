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
};

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
