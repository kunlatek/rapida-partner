import { EFormContractDataType } from "../../../enums/form-contract.enum";
import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const movieForm: IForm = {
  title: "Gerenciar filme",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de filmes para cadastrar e editar filmes, incluindo a foto, o nome, a descrição, a data de lançamento, a pontuação no IMDb e os gêneros associados. Quero também ter a opção de adicionar e gerenciar episódios, incluindo seus títulos, descrições, datas de lançamento e personagens relacionados. Isso me permite manter um registro completo e detalhado do conteúdo audiovisual no sistema.`,
  componentType: "form",
  contracts: [
    {
      endpoint: "/movies",
      methods: [{ verb: "POST" }, { verb: "PUT" }, { verb: "GET" }, { verb: "DELETE" }],
      request: {
        body: [
          {
            name: "pictureFile",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "name",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "description",
            dataType: EFormContractDataType.WYSIWYG,
          },
          {
            name: "releaseDate",
            dataType: EFormContractDataType.DATE,
          },
          {
            name: "imdbRating",
            dataType: EFormContractDataType.NUMBER,
          },
          {
            name: "movieGenres",
            dataType: "array",
            elements: [
              {
                name: "movieGenreId",
                dataType: EFormContractDataType.TEXT,
              },
            ],
          },
          {
            name: "link1",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "link2",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "link3",
            dataType: EFormContractDataType.TEXT,
          },
          {
            name: "episodes",
            dataType: "array",
            elements: [
              {
                name: "episodeTitle",
                dataType: EFormContractDataType.TEXT,
              },
              {
                name: "episodeDescription",
                dataType: EFormContractDataType.WYSIWYG,
              },
              {
                name: "episodeReleaseDate",
                dataType: EFormContractDataType.DATE,
              },
              {
                name: "charactersId",
                dataType: "array",
                elements: [
                  {
                    name: "characterId",
                    dataType: EFormContractDataType.TEXT,
                  },
                ],
              },
            ],
          },
        ]
      }
    }
  ],
  id: "movieForm",
  guards: "isAuthorized",
  elements: [
    {
      type: "tab",
      id: "movieTab",
      tabs: [
        {
          id: "mainTab",
          title: "Principal",
          elements: [
            {
              label: "Foto",
              type: "file",
              dataType: EDataType.TEXT,
              name: "pictureFile",
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "movies",
                visibility: "public",
              },
            },
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
            {
              type: "input",
              dataType: EDataType.DATE,
              label: "Data de lançamento",
              name: "releaseDate",
              isRequired: true,
            },
            {
              type: "input",
              name: "imdbRating",
              label: "Pontuação do IMDb",
              dataType: EDataType.NUMBER,
              isRequired: true,
            },
            {
              type: "autocomplete",
              dataType: EDataType.TEXT,
              label: "Gêneros",
              name: "movieGenres",
              optionsApi: {
                endpoint: "/api/movies-genres",
                labelField: ["name"],
                valueField: "_id",
                paramsToFilter: ["name"],
                paramType: "query",
              },
              isMultiple: true,
              isRequired: true,
            },
            {
              type: "input",
              name: "link1",
              label: "Link 1",
              dataType: EDataType.TEXT,
              isRequired: true,
            },
            {
              type: "input",
              name: "link2",
              label: "Link 2",
              dataType: EDataType.TEXT,
            },
            {
              type: "input",
              name: "link3",
              label: "Link 3",
              dataType: EDataType.TEXT,
            },
          ],
        },
        {
          id: "episodesTab",
          title: "Episódios",
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
          conditions: [
            {
              type: "form",
              elements: [
                {
                  key: "movieGenres",
                  comparisonOperator: "===",
                  value: "Série de TV",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
