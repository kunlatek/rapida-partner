import { describe, expect, test } from "bun:test";
import type { IProject } from "../interfaces/project.interface";
import { checkListReferences } from "./list-references";

const input = (name: string, dataType: string = "text"): Record<string, unknown> => ({ type: "input", name, label: name, dataType });
const form = (id: string, endpoint: string, elements: unknown[]): Record<string, unknown> => ({
  componentType: "form",
  id,
  elements,
  contracts: [{ id, endpoint, actions: ["create"] }],
});
const list = (extra: Record<string, unknown>): Record<string, unknown> => ({
  componentType: "list",
  id: "billList",
  dataSource: { endpoint: "/bills", paramType: "query" },
  listItems: [],
  ...extra,
});
const projectWith = (components: unknown[]): IProject => ({ id: "p", modules: [{ id: "m", components }] }) as unknown as IProject;

const billForm = form("bill", "/bills", [
  input("amount", "currency"),
  input("status"),
  { type: "select", name: "qty", label: "qty", dataType: "number", options: [] },
  { type: "array", name: "deps", label: "deps", elements: [input("price", "number")] },
]);
const otherForm = form("other", "/others", [input("otherTotal", "currency")]);

describe("kpis", () => {
  test("sumOf num input numérico do form da lista não avisa", () => {
    expect(checkListReferences(projectWith([billForm, otherForm, list({ kpis: [{ label: "a", sumOf: "amount" }] })]))).toEqual([]);
  });

  test("sumOf de outro form do módulo avisa, porque a soma é da entidade da lista", () => {
    const warnings = checkListReferences(projectWith([billForm, otherForm, list({ kpis: [{ label: "a", sumOf: "otherTotal" }] })]));
    expect(warnings).toEqual(["billList: kpis.sumOf \"otherTotal\" não existe no form bill (entidade de /bills) (campos de array não valem)"]);
  });

  test("sumOf que não é input avisa, mesmo com dataType numérico", () => {
    const warnings = checkListReferences(projectWith([billForm, list({ kpis: [{ label: "a", sumOf: "qty" }] })]));
    expect(warnings).toEqual(["billList: kpis.sumOf \"qty\" não é um input numérico; a rota de soma só soma inputs numéricos"]);
  });

  test("sumOf de texto e campo de array avisam", () => {
    const warnings = checkListReferences(projectWith([billForm, list({ kpis: [{ label: "a", sumOf: "status" }, { label: "b", sumOf: "price" }] })]));
    expect(warnings).toEqual([
      "billList: kpis.sumOf \"status\" não é um input numérico; a rota de soma só soma inputs numéricos",
      "billList: kpis.sumOf \"price\" não existe no form bill (entidade de /bills) (campos de array não valem)",
    ]);
  });

  test("filter só aceita campos do form da lista", () => {
    const kpis = [{ label: "a", filter: [{ field: "status", op: "eq", value: "open" }, { field: "otherTotal", op: "gt", value: 0 }] }];
    expect(checkListReferences(projectWith([billForm, otherForm, list({ kpis })]))).toEqual([
      "billList: kpis.filter cita o campo \"otherTotal\", que não existe no form bill (entidade de /bills) (campos de array não valem)",
    ]);
  });

  test("sem form com o endpoint da lista, confere contra os forms do módulo", () => {
    const warnings = checkListReferences(projectWith([otherForm, list({ kpis: [{ label: "a", sumOf: "otherTotal" }, { label: "b", sumOf: "nope" }] })]));
    expect(warnings).toEqual(["billList: kpis.sumOf \"nope\" não existe no nível de cima de nenhum form do módulo (campos de array não valem)"]);
  });

  test("mais de um brand avisa", () => {
    const kpis = [{ label: "a", tone: "brand" }, { label: "b", tone: "brand" }];
    expect(checkListReferences(projectWith([billForm, list({ kpis })]))).toEqual(["billList: mais de um KPI com tone \"brand\"; use no máximo um"]);
  });
});

describe("columnGroup", () => {
  const item = (property: string, columnGroup?: string): Record<string, unknown> => ({ property, label: property, dataType: "text", ...(columnGroup ? { columnGroup } : {}) });

  test("grupos juntos e colunas sem grupo nas pontas não avisam", () => {
    expect(checkListReferences(projectWith([billForm, list({ listItems: [item("a"), item("b", "Valores"), item("c", "Valores"), item("d")] })]))).toEqual([]);
  });

  test("grupo interrompido por outro grupo avisa", () => {
    const listItems = [item("a", "Valores"), item("b", "Datas"), item("c", "Valores")];
    expect(checkListReferences(projectWith([billForm, list({ listItems })]))).toEqual(["billList: o columnGroup \"Valores\" aparece separado; deixe as colunas do mesmo grupo juntas"]);
  });

  test("grupo interrompido por uma coluna sem grupo avisa", () => {
    const listItems = [item("a", "Valores"), item("b"), item("c", "Valores")];
    expect(checkListReferences(projectWith([billForm, list({ listItems })]))).toEqual(["billList: o columnGroup \"Valores\" aparece separado; deixe as colunas do mesmo grupo juntas"]);
  });
});

describe("quickFilters, tabs e columnViews", () => {
  test("nomes que não existem avisam", () => {
    const warnings = checkListReferences(
      projectWith([billForm, list({ quickFilters: ["status"], listFilters: [], tabs: { property: "nope" }, columnViews: [{ label: "v", columns: ["ghost"] }] })]),
    );
    expect(warnings).toEqual([
      "billList: quickFilters cita \"status\", que não está em listFilters",
      "billList: tabs.property \"nope\" não existe em nenhum form do módulo e tabs.options está vazio",
      "billList: columnViews cita a coluna \"ghost\", que não está em listItems",
    ]);
  });

  test("tabs.property aceita campo de dentro de array", () => {
    expect(checkListReferences(projectWith([billForm, list({ tabs: { property: "price" } })]))).toEqual([]);
  });
});
