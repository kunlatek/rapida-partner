import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const actorList: IList = {
  title: "Lista de atores / atrizes",
  componentType: "list",
  id: "actorList",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/actors",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    { label: "Nome", property: "name", type: "title", dataType: EDataType.NVARCHAR },
    { label: "Descrição", property: "biography", type: "description", isHtml: true, dataType: EDataType.LONGTEXT },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/actors",
          propertiesAsPathParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        linkAfterAction: {
          endpoint: "/actors",
        },
        request: {
          endpoint: "/actors",
          verb: "softDelete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir conteúdo",
            message: "Deseja realmente excluir esse conteúdo?",
          }
        }
      },
    }
  ],
  contracts: [
    {
      id: "actors",
      endpoint: "/actors",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "actors",
        description: "Represents an actor or actress in the system.",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "socialName", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "birthDate", dataType: EDataType.DATE, isRequired: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR },
          { name: "biography", dataType: EDataType.LONGTEXT },
        ]
      }
    }
  ],
};