import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const brandList: IList = {
  componentType: "list",
  id: "brandList",
  title: "Lista de marcas",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/brands",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    {
      property: "pictureFile", type: "image", label: "Logo", dataType: EDataType.NVARCHAR,
    },
    {
      property: "name", type: "title", label: "Nome", dataType: EDataType.NVARCHAR,
    },
    {
      property: "description", type: "description", label: "Descrição", isHtml: true, dataType: EDataType.LONGTEXT,
    },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/brands",
          propertiesAsPathParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        linkAfterAction: {
          endpoint: "/brands",
        },
        request: {
          endpoint: "/brands",
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
  "pagination": {
    "enabled": true,
    "pageSize": 15,
    "pageSizeOptions": [10, 15, 25, 50],
    "position": "bottom"
  },
contracts: [
    {
      id: "brands",
      endpoint: "/brands",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "brands",
        description: "",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR, isRequired: false },
          {
            name: "name",
            dataType: EDataType.TEXT,
            isRequired: true,
            maxSize: 255,
          },
          {
            name: "description",
            dataType: EDataType.TEXT,
            isRequired: true,
            maxSize: 255,
          }
        ]
      }
    }
  ],
};