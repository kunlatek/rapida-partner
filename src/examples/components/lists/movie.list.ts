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
      property: "pictureFile", type: "image", label: "Cartaz",
    },
    {
      property: "name", type: "title", label: "Nome",
    },
    {
      property: "releaseDate", type: "subtitle", label: "Data de lançamento",
    },
    {
      property: "movieGenres.name", type: "subtitle", label: "Gênero",
    },
    {
      property: "description", type: "description", label: "Descrição", isHtml: true,
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
  ]
};