import { describe, expect, test } from "bun:test";
import { STORE_SEGMENT_DEFAULT_FEATURES, STORE_SEGMENT_DEFAULT_SETTINGS, storeFeaturesOf } from "./store-segment";

describe("storeFeaturesOf", () => {
  test("sem store ou sem segmento e sem lista, nenhuma funcionalidade", () => {
    expect(storeFeaturesOf(undefined)).toEqual([]);
    expect(storeFeaturesOf({})).toEqual([]);
  });

  test("a lista do projeto sempre vale, mesmo vazia", () => {
    expect(storeFeaturesOf({ segment: "food", features: ["blog"] })).toEqual(["blog"]);
    expect(storeFeaturesOf({ segment: "events", features: [] })).toEqual([]);
  });

  test("sem lista, vale o padrão do segmento", () => {
    expect(storeFeaturesOf({ segment: "food" })).toEqual(STORE_SEGMENT_DEFAULT_FEATURES.food);
    expect(storeFeaturesOf({ segment: "events" })).toEqual(["stockAvailability", "installments", "coupons", "stockReservation", "productVariants", "productOptions"]);
  });

  test("devolve uma cópia, sem alterar o padrão", () => {
    storeFeaturesOf({ segment: "retail" }).push("blog");
    expect(STORE_SEGMENT_DEFAULT_FEATURES.retail).not.toContain("blog");
  });

  test("blog nunca vem no padrão", () => {
    for (const features of Object.values(STORE_SEGMENT_DEFAULT_FEATURES)) expect(features).not.toContain("blog");
  });
});

describe("STORE_SEGMENT_DEFAULT_SETTINGS", () => {
  test("retail mantém o catálogo de sempre", () => {
    expect(STORE_SEGMENT_DEFAULT_SETTINGS.retail).toEqual({ catalogLayout: "grid", catalogColumns: 3, productImageAspect: "auto" });
  });

  test("food usa lista", () => {
    expect(STORE_SEGMENT_DEFAULT_SETTINGS.food.catalogLayout).toBe("list");
  });
});
