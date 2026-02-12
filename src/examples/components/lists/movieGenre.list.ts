import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const movieGenreList: IList = {
  componentType: "list",
  id: "movieGenreList",
  title: "Lista de gêneros de filmes",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/movie-genres",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
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
          endpoint: "/movie-genre-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/movie-genre-list",
        },
        request: {
          endpoint: "/movie-genres",
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
      id: "movieGenres",
      endpoint: "/movie-genres",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "MovieGenre",
        description: "",
        fields: [
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