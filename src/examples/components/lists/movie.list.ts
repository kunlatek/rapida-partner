import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const movieList: IList = {
  componentType: "list",
  id: "movieList",
  title: "Lista de filmes",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/movies",
    paramType: "query",
    hasAuthentication: true,
  },
  properties: [
    {
      property: "pictureFile", type: "image", label: "Cartaz", dataType: EDataType.NVARCHAR,
    },
    {
      property: "name", type: "title", label: "Nome", dataType: EDataType.NVARCHAR,
    },
    {
      property: "releaseDate", type: "subtitle", label: "Data de lançamento", dataType: EDataType.DATETIME2,
    },
    {
      property: "movieGenres.name", type: "subtitle", label: "Gênero", dataType: EDataType.NVARCHAR,
    },
    {
      property: "description", type: "description", label: "Descrição", isHtml: true, dataType: EDataType.LONGTEXT
    },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/movie-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/movie-list",
        },
        request: {
          endpoint: "/movies",
          verb: "delete",
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
      id: "movies",
      endpoint: "/movies",
      actions: ["create", "update", "getById", "get", "delete"],
      request: {
        entity: "Movie",
        description: "Represents a movie or TV series in the system.",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR, isRequired: false },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "description", dataType: EDataType.LONGTEXT, isRequired: true },
          { name: "releaseDate", dataType: EDataType.DATETIME2, isRequired: true },
          { name: "imdbRating", dataType: EDataType.FLOAT, isRequired: true },
          { name: "movieGenres", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, foreignKey: {
            entity: "MovieGenre",
            connectionAttribute: "_id",
            relationship: "many-to-many"
          } },
          { name: "link1", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "link2", dataType: EDataType.NVARCHAR, isRequired: false },
          { name: "link3", dataType: EDataType.NVARCHAR, isRequired: false },
        ],
      }
    }
  ],
};