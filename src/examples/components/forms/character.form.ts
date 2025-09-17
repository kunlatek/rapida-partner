import type { IForm } from "../../../interfaces/form.interface";

export const characterForm: IForm = {
  title: "Personagem",
  userStory: `Como um usuário autorizado, quero usar o formulário de personagem para criar e editar personagens, fornecendo um nome, uma descrição, um tipo (como "protagonista" ou "antagonista") e um gênero para cada um. Isso me permite manter um registro detalhado e organizado dos personagens no sistema.`,
  componentType: "form",
  id: "characterForm",
  guards: "isAuthorized",
  elements: [
    {
      type: "input",
      dataType: "text",
      label: "Nome do personagem",
      name: "characterName",
      isRequired: true,
    },
    // file - Foto do personagem
    {
      type: "file",
      label: "Foto do personagem",
      name: "characterImage",
      storageConfig: {
        fileNameStrategy: "uuid",
        path: "characters",
        visibility: "public",
      },
    },
    {
      type: "input",
      dataType: "wysiwyg",
      label: "Descrição do personagem",
      name: "characterDescription",
    },
    {
      type: "select",
      label: "Tipo de personagem",
      name: "characterType",
      dataType: "text",
      options: [
        { value: "protagonist", label: "Protagonista" },
        { value: "antagonist", label: "Antagonista" },
        { value: "hero", label: "Herói" },
        { value: "villain", label: "Vilão" },
        { value: "sidekick", label: "Ajudante" },
        { value: "supporting", label: "Secundário" },
      ],
    },
    {
      type: "select",
      label: "Gênero do personagem",
      name: "characterGender",
      dataType: "text",
      options: [
        { value: "male", label: "Masculino" },
        { value: "female", label: "Feminino" },
        { value: "non-binary", label: "Não-binário" },
        { value: "other", label: "Outro" },
      ],
    }
  ],
  apiConfig: {
    create: [{
      endpoint: "/characters",
      method: "POST",
    }],
    update: {
      endpoint: "/characters/:id",
      method: "PUT",
      propertiesAsPathParam: ["_id"],
    },
  },
};