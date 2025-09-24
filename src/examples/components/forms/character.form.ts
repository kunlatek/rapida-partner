import { EFormContractDataType } from "../../../enums/form-contract.enum";
import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const characterForm: IForm = {
  title: "Personagem",
  userStory: `Como um usuário autorizado, quero usar o formulário de personagem para criar e editar personagens, fornecendo um nome, uma descrição, um tipo (como "protagonista" ou "antagonista") e um gênero para cada um. Isso me permite manter um registro detalhado e organizado dos personagens no sistema.`,
  componentType: "form",
  id: "characterForm",
  contracts: [
    {
      endpoint: "/characters",
      methods: [{ verb: "POST" }, { verb: "PUT" }, { verb: "GET" }, { verb: "DELETE" }],
      request: {
        body: [
          {
            name: "characterName",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "characterImage",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "characterDescription",
            dataType: EFormContractDataType.WYSIWYG,
          },
          {
            name: "characterType",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "characterGender",
            dataType: EFormContractDataType.TEXT,
          },
        ],
      },
    }
  ],
  guards: "isAuthorized",
  elements: [
    {
      type: "input",
      dataType: EDataType.TEXT,
      label: "Nome do personagem",
      name: "characterName",
      isRequired: true,
    },
    // file - Foto do personagem
    {
      label: "Foto do personagem",
      type: "file",
      dataType: EDataType.TEXT,
      name: "characterImage",
      storageConfig: {
        fileNameStrategy: "uuid",
        path: "characters",
        visibility: "public",
      },
    },
    {
      type: "input",
      dataType: EDataType.WYSIWYG,
      label: "Descrição do personagem",
      name: "characterDescription",
    },
    {
      type: "select",
      label: "Tipo de personagem",
      name: "characterType",
      dataType: EDataType.TEXT,
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
      dataType: EDataType.TEXT,
      options: [
        { value: "male", label: "Masculino" },
        { value: "female", label: "Feminino" },
        { value: "non-binary", label: "Não-binário" },
        { value: "other", label: "Outro" },
      ],
    }
  ],
};