import type { IProject } from "../interfaces/project.interface";

const SELLING_SKELETONS: string[] = ["ecommerce", "marketplace"];

export const checkStoreReferences = (project: IProject): string[] => {
  const segment = project.store?.segment;
  if (!segment || SELLING_SKELETONS.includes(project.skeleton)) return [];
  return [
    "store.segment \"" + segment + "\" só vale para skeleton \"ecommerce\" ou \"marketplace\"; com \"" + project.skeleton + "\" ele é ignorado",
  ];
};
