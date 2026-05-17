import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const productList: IList = {
  componentType: "list",
  id: "productList",
  title: "Lista de produtos",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/products",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    {
      property: "productImages",
      type: "image",
      label: "Imagem",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "name",
      type: "title",
      label: "Nome",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "ean13",
      type: "subtitle",
      label: "Código de barras",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "description",
      type: "description",
      isHtml: true,
      label: "Descrição",
      dataType: EDataType.LONGTEXT,
    },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/products",
          propertiesAsPathParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        linkAfterAction: {
          endpoint: "/products",
        },
        request: {
          endpoint: "/products",
          verb: "softDelete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir conteúdo",
            message: "Deseja realmente excluir esse conteúdo?",
          },
        },
      },
    },
  ],
  contracts: [
    {
      id: "products",
      endpoint: "/products",
      actions: ["create", "update", "get", "getById", "softDelete"],
      request: {
        entity: "products",
        fields: [],
      },
    },
  ],
};
