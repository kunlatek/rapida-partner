import type { IForm } from "../../../interfaces/form.interface";

export const movieGenreForm: IForm = {
  title: "Gerenciar gênero de filme",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de gênero de filme para criar e editar gêneros de filmes, fornecendo um nome e uma descrição para cada um. Isso me permite organizar e categorizar filmes de forma precisa no sistema.`,
  componentType: "form",
  contracts: [
    {
      endpoint: "/movie-genres",
      methods: [{ verb: "POST" }, { verb: "PUT" }, { verb: "GET" }, { verb: "DELETE" }],
      request: {
        body: [
          {
            name: "name",
            dataType: "text",
          },
          {
            name: "description",
            dataType: "wysiwyg",
          },
        ],
      },
    }
  ],
  id: "movieGenreForm",
  guards: "isAuthorized",
  elements: [
    {
      type: "input",
      dataType: "text",
      label: "Nome",
      name: "name",
      isRequired: true,
    },
    {
      type: "input",
      dataType: "wysiwyg",
      label: "Descrição",
      name: "description",
      isRequired: true,
    },
  ],
};
