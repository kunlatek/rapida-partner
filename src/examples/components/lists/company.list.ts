import type { IList } from "../../../interfaces/list.interface";

export const companyList: IList = {
  componentType: "list",
  id: "companyList",
  title: "Lista de empresas",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/companies",
    paramType: "query",
    hasAuthentication: true,
  },
  properties: [
    { label: "CNPJ", property: "companyCnpj", type: "title" },
    { label: "Nome", property: "companyName", type: "title" },
    { label: "Telefone", property: "companyPhoneOne", type: "subtitle" },
    { label: "E-mail", property: "companyEmailOne", type: "subtitle" },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/company-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/company-list",
        },
        request: {
          endpoint: "/companies",
          verb: "delete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir empresa",
            message: "Deseja realmente excluir essa empresa?",
          }
        }
      },
    }
  ]
};