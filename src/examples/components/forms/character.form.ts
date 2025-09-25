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
        entity: "Character",
        description: "Represents a character in a story or narrative.",
        fields: [
          { name: "_id", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "characterName", dataType: EFormContractDataType.NVARCHAR, isRequired: true },
          { name: "characterImage", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
          { name: "characterDescription", dataType: EFormContractDataType.LONGTEXT, isRequired: false },
          { name: "characterType", dataType: EFormContractDataType.NVARCHAR, enum: ["protagonist", "antagonist", "hero", "villain", "sidekick", "supporting"], isRequired: false },
          { name: "characterGender", dataType: EFormContractDataType.NVARCHAR, enum: ["male", "female", "other"], isRequired: false },
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
        { value: "other", label: "Outro" },
      ],
    }
  ],
};