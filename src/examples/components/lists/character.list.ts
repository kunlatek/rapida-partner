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
  properties: [
    { label: "Nome", property: "characterName", type: "title" },
    { label: "Descrição", property: "characterDescription", type: "description", isHtml: true, },
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
          verb: "delete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir projeto",
            message: "Deseja realmente excluir essa projeto?",
          }
        }
      },
    }
  ]
};