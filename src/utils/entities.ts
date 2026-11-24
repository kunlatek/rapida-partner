import type { IComponent, IModule, IProject } from "../interfaces/project.interface";

export interface IFormEntity {
  component: IComponent;
  endpoint: string;
  ownsEntity: boolean;
}

interface IEntitySource {
  id: string;
  componentType: string;
  contracts?: { id?: string; endpoint?: string }[];
}

// Mesma regra do kebabfy do gerador: "payableAccount" e "PayableAccount" viram "payable-account".
const kebab = (text: string): string =>
  text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map((part: string) => part.toLowerCase()).join("-") ||
  text.toLowerCase();

export const normalizeEndpoint = (endpoint: string): string => endpoint.replace(/^\/+|\/+$/g, "");

// O backend gerado cria uma entidade por form ou kanban, pelo id do primeiro contrato (ou do componente).
// Quando dois componentes dão a mesma entidade, só o primeiro do projeto gera o backend.
export const formEntitiesOf = (project: IProject): IFormEntity[] => {
  const seen = new Set<string>();
  return (project.modules ?? []).flatMap((module: IModule): IFormEntity[] =>
    module.components.flatMap((component: IComponent): IFormEntity[] => {
      if (component.componentType !== "form" && component.componentType !== "kanban") return [];
      const source = component as unknown as IEntitySource;
      const contract = source.contracts?.[0];
      const key: string = kebab(contract?.id || source.id || "Unnamed");
      const ownsEntity: boolean = !seen.has(key);
      seen.add(key);
      if (component.componentType !== "form") return [];
      return [{ component, endpoint: normalizeEndpoint(contract?.endpoint || key), ownsEntity }];
    }),
  );
};
