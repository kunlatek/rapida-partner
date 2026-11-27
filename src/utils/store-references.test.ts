import { describe, expect, test } from "bun:test";
import type { IProject } from "../interfaces/project.interface";
import { checkStoreReferences } from "./store-references";

const projectWith = (skeleton: string, store?: Record<string, unknown>): IProject =>
  ({ id: "p", title: "p", skeleton, ...(store ? { store } : {}) }) as unknown as IProject;

describe("store.segment", () => {
  test("sem segmento não avisa", () => {
    expect(checkStoreReferences(projectWith("ecommerce", { features: [] }))).toEqual([]);
    expect(checkStoreReferences(projectWith("backoffice"))).toEqual([]);
  });

  test("em ecommerce e marketplace não avisa", () => {
    expect(checkStoreReferences(projectWith("ecommerce", { segment: "food" }))).toEqual([]);
    expect(checkStoreReferences(projectWith("marketplace", { segment: "events" }))).toEqual([]);
  });

  test("em skeleton sem venda própria avisa que é ignorado", () => {
    expect(checkStoreReferences(projectWith("referralCommerce", { segment: "retail" }))).toEqual([
      "store.segment \"retail\" só vale para skeleton \"ecommerce\" ou \"marketplace\"; com \"referralCommerce\" ele é ignorado",
    ]);
  });
});

const storeWithBadges = (marketplaces: Array<Record<string, string>>): IProject =>
  ({
    id: "p",
    title: "p",
    skeleton: "ecommerce",
    store: { features: ["productBadges"] },
    backend: marketplaces.map((marketplace) => ({ marketplace })),
  }) as unknown as IProject;

describe("store.features com endereços obrigatórios", () => {
  test("productBadges com os dois endereços num ambiente não avisa", () => {
    expect(checkStoreReferences(storeWithBadges([{ badgesEndpoint: "/store-badges", productSellingSettingsEndpoint: "/product-selling-settings" }]))).toEqual([]);
  });

  test("productBadges sem badgesEndpoint ou sem a configuração de venda avisa", () => {
    const warning = "store.features \"productBadges\" precisa de backend.marketplace.badgesEndpoint e backend.marketplace.productSellingSettingsEndpoint; sem eles a funcionalidade não é gerada";
    expect(checkStoreReferences(storeWithBadges([{ productSellingSettingsEndpoint: "/product-selling-settings" }]))).toEqual([warning]);
    expect(checkStoreReferences(storeWithBadges([{ badgesEndpoint: "/store-badges" }]))).toEqual([warning]);
    expect(checkStoreReferences(storeWithBadges([]))).toEqual([warning]);
  });

  test("funcionalidade fora da lista, ou só no padrão de outro segmento, não avisa", () => {
    expect(checkStoreReferences(projectWith("ecommerce", { segment: "food" }))).toEqual([]);
    expect(checkStoreReferences(projectWith("referralCommerce", { features: ["productBadges"] }))).toEqual([]);
  });
});

describe("vitrine de cupons", () => {
  const store = (features: string[], marketplace: Record<string, string>): IProject =>
    ({ id: "p", title: "p", skeleton: "ecommerce", store: { features }, backend: [{ marketplace }] }) as unknown as IProject;

  test("com cupons e couponsEndpoint não avisa", () => {
    expect(checkStoreReferences(store(["coupons", "couponShowcase"], { couponsEndpoint: "/store-coupons" }))).toEqual([]);
  });

  test("sem couponsEndpoint ou sem a funcionalidade de cupons avisa", () => {
    expect(checkStoreReferences(store(["coupons", "couponShowcase"], {}))).toEqual([
      "store.features \"couponShowcase\" precisa de backend.marketplace.couponsEndpoint; sem ele a funcionalidade não é gerada",
    ]);
    expect(checkStoreReferences(store(["couponShowcase"], { couponsEndpoint: "/store-coupons" }))).toEqual([
      "store.features \"couponShowcase\" só funciona junto com \"coupons\"; sem ela a funcionalidade não é gerada",
    ]);
  });
});

describe("coleções da home", () => {
  const store = (marketplace: Record<string, string>): IProject =>
    ({ id: "p", title: "p", skeleton: "marketplace", store: { features: ["collections"] }, backend: [{ marketplace }] }) as unknown as IProject;

  test("com collectionsEndpoint não avisa; sem ele avisa", () => {
    expect(checkStoreReferences(store({ collectionsEndpoint: "/store-collections" }))).toEqual([]);
    expect(checkStoreReferences(store({}))).toEqual([
      "store.features \"collections\" precisa de backend.marketplace.collectionsEndpoint; sem ele a funcionalidade não é gerada",
    ]);
  });
});
