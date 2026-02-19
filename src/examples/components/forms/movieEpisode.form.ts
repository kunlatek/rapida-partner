import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const movieEpisodeForm: IForm = {
  title: "Gerenciar episódio",
  componentType: "form",
  id: "movieEpisodeForm",
  elements: [
    {
      label: "Episódio",
      name: "episodes",
      type: EDataType.ARRAY,
      elements: [
        {
          label: "Título do episódio",
          name: "episodeTitle",
          type: "input",
          dataType: EDataType.TEXT,
          isRequired: true,
        },
        {
          label: "Descrição do episódio",
          name: "episodeDescription",
          type: "input",
          dataType: EDataType.WYSIWYG,
        },
        {
          label: "Data de lançamento do episódio",
          name: "episodeReleaseDate",
          type: "input",
          dataType: EDataType.DATE,
        },
        {
          label: "Personagem",
          type: "autocomplete",
          dataType: EDataType.UNIQUEIDENTIFIER,
          name: "charactersId",
          isMultiple: true,
          optionsApi: {
            endpoint: "/characters",
            labelField: ["characterName"],
            valueField: "_id",
            paramsToFilter: ["characterName"],
            paramType: "query",
            relatedEntity: "Character",
          },
          isRequired: true,
        },
      ],
    },
  ],
  contracts: [
    {
      id: "movieEpisodes",
      endpoint: "/movie-episodes",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "MovieEpisode",
        description: "Represents an episode of a TV series or show.",
        fields: [
          {
            name: "_id",
            dataType: EDataType.UNIQUEIDENTIFIER,
            isRequired: true,
            isPrimaryKey: true,
          },
          {
            name: "movieId",
            dataType: EDataType.UNIQUEIDENTIFIER,
            isRequired: true,
            foreignKey: {
              entity: "Movie",
              connectionAttribute: "_id",
              relationship: "one-to-many",
            },
          },
          { name: "title", dataType: EDataType.NVARCHAR, isRequired: true },
          {
            name: "description",
            dataType: EDataType.LONGTEXT,
            isRequired: true,
          },
          {
            name: "releaseDate",
            dataType: EDataType.DATETIME2,
            isRequired: true,
          },
          {
            name: "characters",
            dataType: EDataType.UNIQUEIDENTIFIER,
            isRequired: false,
            foreignKey: {
              entity: "Character",
              connectionAttribute: "_id",
              relationship: "many-to-many",
            },
          },
        ],
      },
    },
  ],
};
