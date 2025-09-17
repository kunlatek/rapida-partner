import type { IForm } from "../../../interfaces/form.interface";

export const movieForm: IForm = {
  title: "Gerenciar filme",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de filmes para cadastrar e editar filmes, incluindo a foto, o nome, a descrição, a data de lançamento, a pontuação no IMDb e os gêneros associados. Quero também ter a opção de adicionar e gerenciar episódios, incluindo seus títulos, descrições, datas de lançamento e personagens relacionados. Isso me permite manter um registro completo e detalhado do conteúdo audiovisual no sistema.`,
  componentType: "form",
  apiConfig: {
    create: [{
      endpoint: "/movies",
      method: "POST",
      contract: {
        request: {
          body: [
            { key: "pictureFile", dataType: "file" },
            { key: "name", dataType: "text" },
            { key: "description", dataType: "text" },
            { key: "releaseDate", dataType: "date" },
            { key: "imdbRating", dataType: "number" },
            { key: "movieGenres", dataType: "array" },
            { key: "link1", dataType: "text" },
            { key: "link2", dataType: "text" },
            { key: "link3", dataType: "text" },
            { key: "episodes", dataType: "array" },
          ],
        },
      },
    }],
    update: {
      endpoint: "/movies/:id",
      method: "PUT",
      propertiesAsPathParam: ["_id"],
    },
  },
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
              type: "file",
              label: "Foto",
              name: "pictureFile",
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "movies",
                visibility: "public",
              },
            },
            {
              type: "input",
              dataType: "text",
              label: "Nome",
              name: "name",
              isRequired: true,
            },
            {
              type: "input",
              dataType: "wysiwyg",
              label: "Descrição",
              name: "description",
              isRequired: true,
            },
            {
              type: "input",
              dataType: "date",
              label: "Data de lançamento",
              name: "releaseDate",
              isRequired: true,
            },
            {
              type: "input",
              name: "imdbRating",
              label: "Pontuação do IMDb",
              dataType: "number",
              isRequired: true,
            },
            {
              type: "autocomplete",
              dataType: "text",
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
              dataType: "text",
              isRequired: true,
            },
            {
              type: "input",
              name: "link2",
              label: "Link 2",
              dataType: "text",
            },
            {
              type: "input",
              name: "link3",
              label: "Link 3",
              dataType: "text",
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
                  dataType: "text",
                  label: "Título do episódio",
                  name: "episodeTitle",
                  isRequired: true,
                },
                {
                  type: "input",
                  dataType: "wysiwyg",
                  label: "Descrição do episódio",
                  name: "episodeDescription",
                },
                {
                  type: "input",
                  dataType: "date",
                  label: "Data de lançamento do episódio",
                  name: "episodeReleaseDate",
                },
                {
                  type: "autocomplete",
                  dataType: "text",
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
