import type { IList } from "../../../interfaces/list.interface";

export const customerList: IList = {
  title: "Lista de clientes",
  id: "customerList",
  componentType: "list",
  dataSource: {
    endpoint: "/customers",
    paramType: "query",
  },
  properties: [
    { label: "Tipo", property: "entityRelated", type: "title", },
    { label: "Nome", property: "People.name", type: "subtitle", conditions: [{ type: "property", elements: [{ key: "entityRelated", comparisonOperator: "===", value: "People" }] }] },
    { label: "Telefone", property: "People.phoneOne", type: "subtitle", conditions: [{ type: "property", elements: [{ key: "entityRelated", comparisonOperator: "===", value: "People" }] }] },
    { label: "E-mail", property: "People.emailOne", type: "subtitle", conditions: [{ type: "property", elements: [{ key: "entityRelated", comparisonOperator: "===", value: "People" }] }] },
    { label: "Nome", property: "Companies.companyName", type: "subtitle", conditions: [{ type: "property", elements: [{ key: "entityRelated", comparisonOperator: "===", value: "Companies" }] }] },
    { label: "Telefone", property: "Companies.phoneOne", type: "subtitle", conditions: [{ type: "property", elements: [{ key: "entityRelated", comparisonOperator: "===", value: "Companies" }] }] },
    { label: "E-mail", property: "Companies.emailOne", type: "subtitle", conditions: [{ type: "property", elements: [{ key: "entityRelated", comparisonOperator: "===", value: "Companies" }] }] },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/customer-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/customer-list",
        },
        request: {
          endpoint: "/customers",
          verb: "delete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir conteúdo",
            message: "Deseja realmente excluir esse conteúdo?",
          }
        }
      },
    }
  ]
}