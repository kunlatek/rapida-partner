import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const movieEpisodeList: IList = {
  componentType: "list",
  id: "movieEpisodeList",
  title: "Lista de episódios de filmes",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/movies-episodes",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    {
      property: "episodeTitle", type: "title", label: "Título", dataType: EDataType.NVARCHAR,
    },
    {
      property: "episodeDescription", type: "description", label: "Descrição", isHtml: true, dataType: EDataType.LONGTEXT,
    },
  ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/movie-episode-form",
          propertiesAsQueryParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "delete",
      action: {
        link: {
          endpoint: "/movie-episode-list",
        },
        request: {
          endpoint: "/movies-episodes",
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
      id: "moviesEpisodes",
      endpoint: "/movies-episodes",
      actions: ["create", "get", "getById", "update", "delete"],
      request: {
        entity: "MovieEpisode",
        description: "Represents an episode of a TV series or show.",
        fields: [
          { name: "_id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "movieId", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, foreignKey: {
            entity: "Movie",
            connectionAttribute: "_id",
            relationship: "one-to-many"
          } },
          { name: "title", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "description", dataType: EDataType.LONGTEXT, isRequired: true },
          { name: "releaseDate", dataType: EDataType.DATETIME2, isRequired: true },
          { name: "characters", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: false, foreignKey: {
            entity: "Character",
            connectionAttribute: "_id",
            relationship: "many-to-many"
          } },
        ],
      }
    },
  ],
};