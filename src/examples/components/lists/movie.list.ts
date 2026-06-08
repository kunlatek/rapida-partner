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
  listFilters: [
    {
      type: "input",
      dataType: EDataType.TEXT,
      label: "Nome",
      name: "name",
      isRequired: true,
    },
    {
      type: "input",
      dataType: EDataType.DATE,
      label: "Data de lançamento",
      name: "releaseDate",
      isRequired: true,
    },
    {
      type: "input",
      name: "imdbRating",
      label: "Pontuação do IMDb",
      dataType: EDataType.DECIMAL,
      isRequired: true,
    },
    {
      type: "autocomplete",
      dataType: EDataType.UNIQUEIDENTIFIER,
      label: "Gêneros",
      name: "movieGenresId",
      optionsApi: {
        endpoint: "/api/movie-genres",
        labelField: ["name"],
        valueField: "_id",
        paramsToFilter: ["name"],
        paramType: "query",
        relatedEntity: "movieGenres",
      },
      isMultiple: true,
      isRequired: true,
    },
  ],
  listItems: [
    {
      property: "pictureFile",
      type: "image",
      label: "Cartaz",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "name",
      type: "title",
      label: "Nome",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "releaseDate",
      type: "subtitle",
      label: "Data de lançamento",
      dataType: EDataType.DATE,
    },
    {
      property: "movieGenresId.name",
      type: "subtitle",
      label: "Gênero",
      dataType: EDataType.NVARCHAR,
      isMultiple: true,
    },
    {
      property: "description",
      type: "description",
      label: "Descrição",
      isHtml: true,
      dataType: EDataType.LONGTEXT,
    },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/movies",
          propertiesAsPathParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        linkAfterAction: {
          endpoint: "/movies",
        },
        request: {
          endpoint: "/movies",
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
  pagination: {
    enabled: true,
    pageSize: 15,
    pageSizeOptions: [10, 15, 25, 50],
    position: "bottom",
  },
  contracts: [
    {
      id: "movies",
      endpoint: "/movies",
      actions: ["create", "update", "getById", "get", "softDelete"],
      request: {
        entity: "Movie",
        description: "Represents a movie or TV series in the system.",
        fields: [
          {
            name: "id",
            dataType: EDataType.UNIQUEIDENTIFIER,
            isRequired: true,
            isPrimaryKey: true,
          },
          {
            name: "pictureFile",
            dataType: EDataType.NVARCHAR,
            isRequired: false,
          },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          {
            name: "description",
            dataType: EDataType.LONGTEXT,
            isRequired: true,
          },
          { name: "releaseDate", dataType: EDataType.DATE, isRequired: true },
          { name: "imdbRating", dataType: EDataType.FLOAT, isRequired: true },
          {
            name: "movieGenres",
            dataType: EDataType.UNIQUEIDENTIFIER,
            isRequired: true,
            foreignKey: {
              entity: "movieGenres",
              connectionAttribute: "_id",
              relationship: "many-to-many",
            },
          },
          { name: "link1", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "link2", dataType: EDataType.NVARCHAR, isRequired: false },
          { name: "link3", dataType: EDataType.NVARCHAR, isRequired: false },
        ],
      },
    },
  ],
};
