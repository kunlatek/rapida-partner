import type { IDataTable } from "../../../interfaces/data-table.interface";

export const characterTable: IDataTable = {
  title: "Lista de personagens",
  componentType: "dataTable",
  id: "characterTable",
  dataSource: {
    endpoint: "/characters",
    paramType: "query",
    hasAuthentication: true,
  },
  columns: [
    { type: "title", label: "Nome", property: "characterName" },
    { type: "description", label: "Descrição", property: "characterDescription", isHtml: true },
  ],
  actions: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        type: "link",
        link: {
          route: "/character-form",
          paramProperty: "_id",
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        type: "request",
        link: {
          route: "/character-list",
          paramProperty: "_id",
        },
      },
    },
  ],
};