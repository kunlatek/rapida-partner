import type { IList } from "../../../interfaces/list.interface";

export const personList: IList = {
  componentType: "list",
  id: "personList",
  title: "Lista de pessoas",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/people",
    paramType: "query",
    hasAuthentication: true,
  },
  properties: [
    { label: "Foto", property: "personPicture", type: "image" },
    { label: "CPF", property: "personCpf", type: "title" },
    { label: "Nome", property: "personName", type: "title" },
    { label: "Telefone", property: "personPhoneOne", type: "subtitle" },
    { label: "E-mail", property: "personEmailOne", type: "subtitle" },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/person-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/person-list",
        },
        request: {
          endpoint: "/people",
          verb: "delete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir pessoa",
            message: "Deseja realmente excluir essa pessoa?",
          }
        }
      },
    }
  ]
};