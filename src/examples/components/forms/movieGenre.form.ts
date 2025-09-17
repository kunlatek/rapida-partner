import type { IForm } from "../../../interfaces/form.interface";

export const movieGenreForm: IForm = {
  title: "Gerenciar gênero de filme",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de gênero de filme para criar e editar gêneros de filmes, fornecendo um nome e uma descrição para cada um. Isso me permite organizar e categorizar filmes de forma precisa no sistema.`,
  componentType: "form",
  apiConfig: {
    create: [
      {
        endpoint: "/movies-genres",
        method: "POST",
        contract: {
          request: {
            body: [
              { key: "name", dataType: "text" },
              { key: "description", dataType: "text" },
            ],
          },
        },
      },
    ],
    update: {
      endpoint: "/movies-genres/:id",
      method: "PUT",
      propertiesAsPathParam: ["_id"],
    },
  },
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
