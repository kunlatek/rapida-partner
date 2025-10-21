import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const characterList: IList = {
  title: "Lista de personagens",
  componentType: "list",
  id: "characterList",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/characters",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    { label: "Nome", property: "characterName", type: "title", dataType: EDataType.NVARCHAR },
    { label: "Descrição", property: "characterDescription", type: "description", isHtml: true, dataType: EDataType.LONGTEXT },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/character-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/character-list",
        },
        request: {
          endpoint: "/characters",
          verb: "softDelete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir projeto",
            message: "Deseja realmente excluir essa projeto?",
          }
        }
      },
    }
  ],
  contracts: [
    {
      id: "characters",
      endpoint: "/characters",
      actions: ["get", "getById"],
      request: {
        entity: "characters",
        description: "Represents a character in a story or narrative.",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "characterName", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "characterImage", dataType: EDataType.NVARCHAR, isRequired: false },
          { name: "characterDescription", dataType: EDataType.LONGTEXT, isRequired: false },
          { name: "characterType", dataType: EDataType.NVARCHAR, enum: ["protagonist", "antagonist", "hero", "villain", "sidekick", "supporting"], isRequired: false },
          { name: "characterGender", dataType: EDataType.NVARCHAR, enum: ["male", "female", "other"], isRequired: false },
        ],
      },
    }
  ],
};