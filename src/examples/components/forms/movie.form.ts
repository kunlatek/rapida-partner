import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const movieForm: IForm = {
  title: "Gerenciar filme",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de filmes para cadastrar e editar filmes, incluindo a foto, o nome, a descrição, a data de lançamento, a pontuação no IMDb e os gêneros associados. Quero também ter a opção de adicionar e gerenciar episódios, incluindo seus títulos, descrições, datas de lançamento e personagens relacionados. Isso me permite manter um registro completo e detalhado do conteúdo audiovisual no sistema.`,
  componentType: "form",
  contracts: [
    {
      id: "movies",
      endpoint: "/movies",
      actions: ["create", "update", "getById", "get", "delete"],
      request: {
        entity: "Movie",
        description: "Represents a movie or TV series in the system.",
        fields: [
          { name: "_id", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
          { name: "pictureFile", dataType: EDataType.NVARCHAR, isRequired: false },
          { name: "name", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "description", dataType: EDataType.LONGTEXT, isRequired: true },
          { name: "releaseDate", dataType: EDataType.DATE, isRequired: true },
          { name: "imdbRating", dataType: EDataType.DECIMAL, isRequired: true },
          { name: "movieGenres", dataType: EDataType.UNIQUEIDENTIFIER, isRequired: true, foreignKey: {
            entity: "MovieGenre",
            connectionAttribute: "_id",
            relationship: "many-to-many"
          } },
          { name: "link1", dataType: EDataType.NVARCHAR, isRequired: true },
          { name: "link2", dataType: EDataType.NVARCHAR, isRequired: false },
          { name: "link3", dataType: EDataType.NVARCHAR, isRequired: false },
        ],
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
                relatedEntity: "MovieGenres"
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
      ],
    },
  ],
};
