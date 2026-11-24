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
