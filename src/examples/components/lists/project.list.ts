import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const projectList: IList = {
  componentType: "list",
  id: "projectList",
  title: "Lista de projetos",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/projects",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    {
      label: "Título",
      property: "title",
      type: "title",
      dataType: EDataType.NVARCHAR,
    },
    {
      label: "Descrição",
      property: "description",
      type: "description",
      dataType: EDataType.WYSIWYG,
      isHtml: true,
    },
    // { label: "Usuários compartilhando o projeto", property: "usersSharingProject", type: "subtitle", dataType: EDataType.ARRAY, }, // discuss @alexis
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/projects",
          propertiesAsPathParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "trash",
      action: {
        link: {
          endpoint: "/projects",
        },
        request: {
          endpoint: "/projects",
          verb: "softDelete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir projeto",
            message: "Deseja realmente excluir essa projeto?",
          },
        },
      },
    },
  ],

  pagination: {
    enabled: true,
    pageSize: 15,
    pageSizeOptions: [10, 15, 25, 50],
    position: "bottom",
  },
  contracts: [
    {
      id: "projects",
      endpoint: "/projects",
      actions: ["create", "update", "get", "getById", "softDelete"],
      request: {
        entity: "projects",
        fields: [],
      },
    },
  ],
};
