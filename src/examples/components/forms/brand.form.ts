import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const brandForm: IForm = {
  componentType: "form",
  id: "brandForm",
  title: "Gerenciamento de marcas",
  elements: [
    {
      type: "input",
      dataType: EDataType.TEXT,
      name: "name",
      label: "Nome",
      isRequired: true,
    },
    {
      type: "input",
      dataType: EDataType.LONGTEXT,
      name: "description",
      label: "Descrição",
      isRequired: true,
    },
    {
      type: "file",
      name: "pictureFile",
      label: "Logo",
      dataType: EDataType.NVARCHAR,
      storageConfig: {
        fileNameStrategy: "uuid",
        path: "logos",
        visibility: "public",
      },
    },
  ],
  contracts: [
    {
      id: "brands",
      endpoint: "/brands",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "actors",
        description: "Represents an actor or actress in the system.",
        fields: [
          { name: "id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "description", dataType: EDataType.LONGTEXT, isRequired: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR },
        ]
      },
    }
  ],
};