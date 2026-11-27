import type { IProject } from "../interfaces/project.interface";
import type { IBackend } from "../interfaces/project-backend.interface";
import type { TStoreFeature } from "../interfaces/store-settings.interface";
import { storeFeaturesOf } from "./store-segment";

const SELLING_SKELETONS: string[] = ["ecommerce", "marketplace"];

type TMarketplace = NonNullable<IBackend["marketplace"]>;
type TMarketplaceEndpoint = keyof {
  [K in keyof TMarketplace as TMarketplace[K] extends string | undefined ? K : never]: true;
};

/** Endereços de IMarketplace sem os quais a funcionalidade não é gerada. */
const FEATURE_ENDPOINTS: Partial<Record<TStoreFeature, TMarketplaceEndpoint[]>> = {
  productBadges: ["badgesEndpoint", "productSellingSettingsEndpoint"],
  couponShowcase: ["couponsEndpoint"],
};

/** Funcionalidades que só existem junto com outra. */
const FEATURE_REQUIRES: Partial<Record<TStoreFeature, TStoreFeature>> = {
  couponShowcase: "coupons",
};

const checkSegment = (project: IProject): string[] => {
  const segment = project.store?.segment;
  if (!segment || SELLING_SKELETONS.includes(project.skeleton)) return [];
  return [
    "store.segment \"" + segment + "\" só vale para skeleton \"ecommerce\" ou \"marketplace\"; com \"" + project.skeleton + "\" ele é ignorado",
  ];
};

// Basta um ambiente de backend ter todos os endereços da funcionalidade.
const checkFeatureEndpoints = (project: IProject): string[] => {
  if (!project.store || !SELLING_SKELETONS.includes(project.skeleton)) return [];
  const marketplaces = (project.backend ?? []).flatMap((backend) => (backend.marketplace ? [backend.marketplace] : []));
  return storeFeaturesOf(project.store).flatMap((feature) => {
    const endpoints = FEATURE_ENDPOINTS[feature];
    if (!endpoints || marketplaces.some((marketplace) => endpoints.every((endpoint) => !!marketplace[endpoint]))) return [];
    return [
      "store.features \"" + feature + "\" precisa de backend.marketplace." + endpoints.join(" e backend.marketplace.") + (endpoints.length > 1 ? "; sem eles" : "; sem ele") + " a funcionalidade não é gerada",
    ];
  });
};

const checkFeatureRequires = (project: IProject): string[] => {
  if (!project.store || !SELLING_SKELETONS.includes(project.skeleton)) return [];
  const features = storeFeaturesOf(project.store);
  return features.flatMap((feature) => {
    const required = FEATURE_REQUIRES[feature];
    return required && !features.includes(required)
      ? ["store.features \"" + feature + "\" só funciona junto com \"" + required + "\"; sem ela a funcionalidade não é gerada"]
      : [];
  });
};

export const checkStoreReferences = (project: IProject): string[] => [
  ...checkSegment(project),
  ...checkFeatureEndpoints(project),
  ...checkFeatureRequires(project),
];
