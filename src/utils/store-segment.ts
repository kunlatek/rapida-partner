import type { IProjectStore, IStoreSettings, TStoreFeature, TStoreSegment } from "../interfaces/store-settings.interface";

export const DEFAULT_STORE_SEGMENT: TStoreSegment = "retail";

export const STORE_SEGMENT_DEFAULT_FEATURES: Record<TStoreSegment, TStoreFeature[]> = {
  retail: ["whatsappButton", "stockAvailability", "cashDiscount", "installments", "favorites", "shipping", "coupons", "reviews", "returns", "productVariants"],
  food: ["whatsappButton", "favorites", "coupons", "reviews", "openingHours", "pickup", "districtDelivery", "payOnDelivery", "itemNotes", "productOptions"],
  services: ["whatsappButton", "stockAvailability", "installments", "coupons", "reviews", "stockReservation"],
  events: ["stockAvailability", "installments", "coupons", "stockReservation"],
};

/** Prazo da reserva de estoque, em minutos (funcionalidade "stockReservation"); retail e food só reservam se o projeto ligar. */
export const STORE_SEGMENT_RESERVATION_MINUTES: Record<TStoreSegment, number> = {
  retail: 30,
  food: 15,
  services: 15,
  events: 10,
};

export const STORE_RESERVATION_MINUTES_RANGE = { min: 5, max: 60 } as const;

export const storeFeaturesOf = (store: IProjectStore | undefined): TStoreFeature[] => {
  if (store?.features) return [...store.features];
  return store?.segment ? [...STORE_SEGMENT_DEFAULT_FEATURES[store.segment]] : [];
};

export type TStoreSegmentSettings = Required<Pick<IStoreSettings, "catalogLayout" | "catalogColumns" | "productImageAspect">>;

export const STORE_SEGMENT_DEFAULT_SETTINGS: Record<TStoreSegment, TStoreSegmentSettings> = {
  retail: { catalogLayout: "grid", catalogColumns: 3, productImageAspect: "auto" },
  food: { catalogLayout: "list", catalogColumns: 3, productImageAspect: "square" },
  services: { catalogLayout: "grid", catalogColumns: 3, productImageAspect: "landscape" },
  events: { catalogLayout: "grid", catalogColumns: 3, productImageAspect: "landscape" },
};
