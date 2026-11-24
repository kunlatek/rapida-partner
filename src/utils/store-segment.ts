import type { IProjectStore, TStoreFeature, TStoreSegment } from "../interfaces/store-settings.interface";

export const DEFAULT_STORE_SEGMENT: TStoreSegment = "retail";

export const STORE_SEGMENT_DEFAULT_FEATURES: Record<TStoreSegment, TStoreFeature[]> = {
  retail: ["whatsappButton", "stockAvailability", "cashDiscount", "installments", "favorites", "shipping", "coupons", "reviews", "returns"],
  food: ["whatsappButton", "favorites", "coupons", "reviews"],
  services: ["whatsappButton", "stockAvailability", "installments", "coupons", "reviews"],
  events: ["stockAvailability", "installments", "coupons"],
};

export const storeFeaturesOf = (store: IProjectStore | undefined): TStoreFeature[] => {
  if (store?.features) return [...store.features];
  return store?.segment ? [...STORE_SEGMENT_DEFAULT_FEATURES[store.segment]] : [];
};
