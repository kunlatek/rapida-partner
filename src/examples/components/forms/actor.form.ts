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
      dataType: EDataType.DATETIME2,
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
      dataType: EDataType.LONGTEXT,
    }
  ],
  contracts: [
    {
      id: "actors",
      endpoint: "/actors",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "Actor",
        description: "Represents an actor or actress in the system.",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "socialName", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "birthDate", dataType: EDataType.DATETIME2, isRequired: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR },
          { name: "biography", dataType: EDataType.LONGTEXT },
        ]
      }
    }
  ],
}