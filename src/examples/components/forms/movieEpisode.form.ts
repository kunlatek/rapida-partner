import { EFormContractDataType } from "../../../enums/form-contract.enum";
import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const movieEpisodeForm: IForm = {
  title: "Gerenciar episódio",
  componentType: "form",
  id: "movieEpisodeForm",
  contracts: [
    {
      endpoint: "/movies-episodes",
      actions: ["create", "get", "getById", "update", "delete"],
      request: {
        entity: "MovieEpisode",
        description: "Represents an episode of a TV series or show.",
        fields: [
          { name: "_id", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "movieId", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: true, foreignKey: {
            entity: "Movie",
            connectionAttribute: "_id",
            relationship: "one-to-many"
          } },
          { name: "title", dataType: EFormContractDataType.NVARCHAR, isRequired: true },
          { name: "description", dataType: EFormContractDataType.LONGTEXT, isRequired: true },
          { name: "releaseDate", dataType: EFormContractDataType.DATETIME2, isRequired: true },
          { name: "characters", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: false, foreignKey: {
            entity: "Character",
            connectionAttribute: "_id",
            relationship: "many-to-many"
          } },
        ],
      }
    },
  ],
  elements: [
    {
      type: "array",
      id: "episodes",
      name: "episodes",
      title: "Episódio",
      elements: [
        {
          type: "input",
          dataType: EDataType.TEXT,
          label: "Título do episódio",
          name: "episodeTitle",
          isRequired: true,
        },
        {
          type: "input",
          dataType: EDataType.WYSIWYG,
          label: "Descrição do episódio",
          name: "episodeDescription",
        },
        {
          type: "input",
          dataType: EDataType.DATE,
          label: "Data de lançamento do episódio",
          name: "episodeReleaseDate",
        },
        {
          type: "autocomplete",
          dataType: EDataType.TEXT,
          name: "charactersId",
          label: "Personagens no episódio",
          optionsApi: {
            endpoint: "/characters",
            labelField: ["characterName"],
            valueField: "_id",
            paramsToFilter: ["characterName"],
            paramType: "query",
            relatedEntity: "Character",
          },
        },
      ],
    },
  ],
}