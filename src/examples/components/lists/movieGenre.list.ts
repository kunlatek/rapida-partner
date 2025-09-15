import type { IList } from "../../../interfaces/list.interface";

export const movieGenreList: IList = {
  componentType: "list",
  id: "movieGenreList",
  title: "Lista de gêneros de filmes",
  guards: ["isAuthorized"],
  dataSource: {
    endpoint: "/movies-genres",
    paramType: "query",
    hasAuthentication: true,
  },
  properties: [
    {
      property: "name", type: "title", label: "Nome",
    },
    {
      property: "description", type: "description", label: "Descrição",
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
          endpoint: "/movies-genres",
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