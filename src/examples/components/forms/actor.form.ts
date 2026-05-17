import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const actorForm: IForm = {
  title: "Gerenciar ator / atriz",
  id: "actorForm",
  componentType: "form",
  guards: "isAuthorized",
  elements: [
    {
      label: "Nome",
      name: "name",
      type: "input",
      dataType: EDataType.NVARCHAR,
      isRequired: true,
    },
    {
      label: "Nome social",
      name: "socialName",
      type: "input",
      dataType: EDataType.NVARCHAR,
      isRequired: true,
    },
    {
      label: "Data de nascimento",
      name: "birthDate",
      type: "input",
      dataType: EDataType.DATE,
      isRequired: true,
    },
    {
      label: "Sexo",
      name: "gender",
      type: "radio",
      options: [
        { label: "Masculino", value: "male" },
        { label: "Feminino", value: "female" },
      ],
      isRequired: true,
    },
    {
      label: "Foto",
      name: "pictureFile",
      type: "file",
      dataType: EDataType.NVARCHAR,
      storageConfig: {
        fileNameStrategy: "uuid",
        path: "actors",
        visibility: "public",
      },
    },
    {
      label: "Biografia",
      name: "biography",
      type: "input",
      dataType: EDataType.WYSIWYG,
    },
    {
      label: "Hobbies",
      name: "hobbies",
      type: "checkbox",
      options: [
        { label: "Esportes", value: "sports" },
        { label: "Ler", value: "reading" },
        { label: "Trabalhar", value: "working" },
        { label: "Outros", value: "other" },
      ],
      isRequired: true,
    },
    {
      label: "Outros hobbies",
      name: "otherHobbies",
      type: "input",
      dataType: EDataType.NVARCHAR,
      isRequired: true,
      conditions: {
        form: {
          elements: [
            {
              key: "hobbies",
              value: "other",
              comparisonOperator: "==="
            }
          ]
        },
      },
    },
    {
      label: "Dados verificados",
      name: "verifiedData",
      type: "switch",
    },
  ],
  contracts: [
    {
      id: "actors",
      endpoint: "/actors",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "actors",
        description: "Represents an actor or actress in the system.",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "socialName", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "birthDate", dataType: EDataType.DATE, isRequired: true },
          { name: "gender", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR },
          { name: "biography", dataType: EDataType.LONGTEXT },
          { name: "verifiedData", dataType: EDataType.BOOLEAN, isRequired: true },
        ]
      }
    }
  ],
}