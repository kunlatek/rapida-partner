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
      "store.features \"" + feature + "\" precisa de backend.marketplace." + endpoints.join(" e backend.marketplace.") + "; sem eles a funcionalidade não é gerada",
    ];
  });
};

export const checkStoreReferences = (project: IProject): string[] => [...checkSegment(project), ...checkFeatureEndpoints(project)];
