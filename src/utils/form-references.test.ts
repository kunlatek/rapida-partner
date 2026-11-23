import { describe, expect, test } from "bun:test";
import type { IProject } from "../interfaces/project.interface";
import { checkFormReferences } from "./form-references";

const consent = (name: string): Record<string, unknown> => ({ type: "switch", name, label: name, recordTimestamp: true });
const input = (name: string): Record<string, unknown> => ({ type: "input", name, label: name, dataType: "text" });
const form = (id: string, elements: unknown[]): Record<string, unknown> => ({ componentType: "form", id, elements });
const projectWith = (components: unknown[], profiles?: Record<string, unknown>): IProject =>
  ({ id: "p", modules: [{ id: "m", components }], ...(profiles ? { flows: { profiles } } : {}) }) as unknown as IProject;

describe("recordTimestamp", () => {
  test("no nível de cima do primeiro form, sem colisão, não avisa", () => {
    expect(checkFormReferences(projectWith([form("f", [consent("terms"), input("name")])]))).toEqual([]);
  });

  test("avisa colisão com campo reservado e com campo do form", () => {
    const warnings = checkFormReferences(projectWith([form("f", [consent("created"), consent("terms"), input("termsAt")])]));
    expect(warnings).toContain("f: recordTimestamp em \"created\" gera o campo \"createdAt\", que já existe");
    expect(warnings).toContain("f: recordTimestamp em \"terms\" gera o campo \"termsAt\", que já existe");
  });

  test("compara o nome como o gerador grava no backend", () => {
    const warnings = checkFormReferences(projectWith([form("f", [consent("accepted-terms"), input("accepted_termsAt")])]));
    expect(warnings).toEqual(["f: recordTimestamp em \"accepted-terms\" gera o campo \"accepted_termsAt\", que já existe"]);
  });

  test("dentro de array avisa que o aceite não é registrado, em vez de conferir colisão", () => {
    const warnings = checkFormReferences(projectWith([form("f", [{ type: "array", name: "deps", elements: [consent("terms"), input("termsAt")] }])]));
    expect(warnings).toEqual(["f: recordTimestamp em \"terms\" está dentro de um array; só vale no nível de cima do form, e o aceite não é registrado"]);
  });

  test("num segundo form do módulo, com entidade própria, grava normalmente", () => {
    expect(checkFormReferences(projectWith([form("first", [input("name")]), form("second", [consent("terms")])]))).toEqual([]);
  });

  test("num form que repete a entidade de um form anterior avisa que o aceite não é registrado", () => {
    const contracts = [{ id: "people", endpoint: "/people", actions: ["create"] }];
    const warnings = checkFormReferences(projectWith([{ ...form("first", [input("name")]), contracts }, { ...form("second", [consent("terms")]), contracts }]));
    expect(warnings).toEqual(["second: recordTimestamp em \"terms\" não grava nada: o form usa a mesma entidade (contracts[0].id) de outro form anterior, e o backend vem daquele"]);
  });

  test("forms de perfil (pessoa e empresa) também gravam, e a colisão é conferida", () => {
    const profiles = { personProfile: { id: "person", elements: [consent("terms")] }, companyProfile: { id: "company", elements: [consent("updated")] } };
    expect(checkFormReferences(projectWith([], profiles))).toEqual([
      "company: recordTimestamp em \"updated\" gera o campo \"updatedAt\", que já existe",
      "company: recordTimestamp em \"updated\" gera o campo \"updatedBy\", que já existe",
    ]);
  });
});

describe("range", () => {
  test("avisa range em form, inclusive dentro de array", () => {
    const warnings = checkFormReferences(projectWith([form("f", [{ type: "datepicker", name: "due", range: true }, { type: "array", name: "deps", elements: [{ type: "datepicker", name: "born", range: true }] }])]));
    expect(warnings).toEqual([
      "f: \"due\" tem range, que só vale em listFilters; no form vira uma data simples",
      "f: \"born\" tem range, que só vale em listFilters; no form vira uma data simples",
    ]);
  });
});
