import type { IList, IListKpi } from "../interfaces/list.interface";
import type { IComponent } from "../interfaces/project.interface";
import { normalizeEndpoint, type IFormEntity } from "./entities";
import { fieldScopes, NUMERIC_DATA_TYPES, type IFlatElement } from "./form-elements";

export type TKpiFields = Map<string, IFlatElement>;

const topLevelFields = (components: IComponent[]): TKpiFields =>
  new Map(
    components
      .flatMap((component: IComponent): IFlatElement[] => ("elements" in component ? fieldScopes(component.elements)[0] : []))
      .flatMap((field: IFlatElement): [string, IFlatElement][] => (field.name ? [[field.name, field]] : [])),
  );

// A rota de soma e a contagem são da entidade da lista (dataSource.endpoint): vale só o nível de cima do
// form dessa entidade. Sem form com esse endpoint, cai nos forms do módulo.
export const kpiFieldsOf = (list: IList, entities: IFormEntity[], moduleForms: IComponent[]): { fields: TKpiFields; source: string } => {
  const endpoint: string = normalizeEndpoint(list.dataSource?.endpoint ?? "");
  const entity: IFormEntity | undefined = entities.find((item: IFormEntity) => item.ownsEntity && item.endpoint === endpoint);
  return entity
    ? { fields: topLevelFields([entity.component]), source: "no form " + entity.component.id + " (entidade de /" + endpoint + ")" }
    : { fields: topLevelFields(moduleForms), source: "no nível de cima de nenhum form do módulo" };
};

const sumOfWarnings = (list: IList, kpi: IListKpi, fields: TKpiFields, source: string): string[] => {
  if (!kpi.sumOf) return [];
  const field: IFlatElement | undefined = fields.get(kpi.sumOf);
  if (!field) return [list.id + ": kpis.sumOf \"" + kpi.sumOf + "\" não existe " + source + " (campos de array não valem)"];
  const isNumeric: boolean = NUMERIC_DATA_TYPES.includes((field.dataType ?? "").toLowerCase());
  if (field.type !== "input" || !isNumeric) {
    return [list.id + ": kpis.sumOf \"" + kpi.sumOf + "\" não é um input numérico; a rota de soma só soma inputs numéricos"];
  }
  return [];
};

export const kpiWarnings = (list: IList, fields: TKpiFields, source: string): string[] => {
  const kpis: IListKpi[] = list.kpis ?? [];
  const brand: string[] =
    kpis.filter((kpi: IListKpi) => kpi.tone === "brand").length > 1 ? [list.id + ": mais de um KPI com tone \"brand\"; use no máximo um"] : [];
  return [
    ...brand,
    ...kpis.flatMap((kpi: IListKpi): string[] => [
      ...sumOfWarnings(list, kpi, fields, source),
      ...(Array.isArray(kpi.filter) ? kpi.filter : [])
        .filter((condition) => !fields.has(condition.field))
        .map((condition) => list.id + ": kpis.filter cita o campo \"" + condition.field + "\", que não existe " + source + " (campos de array não valem)"),
    ]),
  ];
};
