import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const movieGenreForm: IForm = {
  title: "Gerenciar gênero de filme",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de gênero de filme para criar e editar gêneros de filmes, fornecendo um nome e uma descrição para cada um. Isso me permite organizar e categorizar filmes de forma precisa no sistema.`,
  componentType: "form",
  id: "movieGenreForm",
  guards: "isAuthorized",
  elements: [
    {
      type: "input",
      dataType: EDataType.TEXT,
      label: "Nome",
      name: "name",
      isRequired: true,
    },
    {
      type: "input",
      dataType: EDataType.WYSIWYG,
      label: "Descrição",
      name: "description",
      isRequired: true,
    },
  ],
  contracts: [
    {
      id: "moviesGenres",
      endpoint: "/movie-genres",
      actions: ["create", "get", "getById", "update", "delete"],
      request : {
        entity: "moviesGenres",
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
