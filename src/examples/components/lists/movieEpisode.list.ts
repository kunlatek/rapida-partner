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
  properties: [
    {
      property: "episodeTitle", type: "title", label: "Título",
    },
    {
      property: "episodeDescription", type: "description", label: "Descrição",
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
  ]
};