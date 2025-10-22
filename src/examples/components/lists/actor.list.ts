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
          endpoint: "/actor-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/actor-list",
        },
        request: {
          endpoint: "/actors",
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
  ],
};