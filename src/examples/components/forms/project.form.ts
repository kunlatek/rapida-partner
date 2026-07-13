import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const projectForm: IForm = {
  title: "Gerenciar projeto",
  id: "projectForm",
  componentType: "form",
  guards: "isAuthorized",
  elements: [
    {
      type: "tab",
      id: "projectTab",
      tabs: [
        {
          title: "Dados principais",
          id: "projectMainDataTab",
          elements: [
            {
              label: "Identificador do projeto",
              name: "identifier",
              type: "input",
              dataType: EDataType.NVARCHAR,
              isRequired: true,
            },
            {
              label: "Título do projeto",
              name: "title",
              type: "input",
              dataType: EDataType.NVARCHAR,
              isRequired: true,
            },
            {
              label: "Descrição do projeto",
              name: "description",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Adicionar pessoa relacionada ao projeto",
              name: "projectsPeople",
              type: "array",
              elements: [
                {
                  label: "Pessoa",
                  name: "personId",
                  type: "autocomplete",
                  dataType: EDataType.UNIQUEIDENTIFIER,
                  optionsApi: {
                    relatedEntity: "people",
                    labelField: ["name", "cpf"],
                    valueField: "_id",
                    paramsToFilter: ["name", "cpf"],
                    paramType: "query",
                    endpoint: "/people",
                  },
                },
                {
                  label: "Relacionamentos",
                  name: "projectsPeopleRelationships",
                  type: "select",
                  dataType: EDataType.NVARCHAR,
                  options: [
                    {
                      label: "Cliente",
                      value: "customer",
                    },
                    {
                      label: "Fornecedor",
                      value: "supplier",
                    },
                    {
                      label: "Desenvolvedor",
                      value: "developer",
                    },
                  ],
                  isMultiple: true,
                },
              ],
            },
            {
              label: "Adicionar empresa relacionada ao projeto",
              name: "projectsCompanies",
              type: "array",
              elements: [
                {
                  label: "Empresa",
                  name: "companyId",
                  type: "autocomplete",
                  dataType: EDataType.UNIQUEIDENTIFIER,
                  optionsApi: {
                    endpoint: "/companies",
                    labelField: ["name", "cnpj"],
                    paramsToFilter: ["name", "cnpj"],
                    paramType: "query",
                    relatedEntity: "companies",
                    valueField: "_id",
                  },
                },
                {
                  label: "Relacionamentos",
                  name: "projectsCompaniesRelationships",
                  type: "select",
                  dataType: EDataType.NVARCHAR,
                  options: [
                    {
                      label: "Cliente",
                      value: "customer",
                    },
                    {
                      label: "Fornecedor",
                      value: "supplier",
                    },
                  ],
                  isMultiple: true,
                },
              ],
            },
          ],
        },
        {
          id: "businessTab",
          title: "Dados de negócio",
          elements: [
            {
              label: "Valor do negócio",
              name: "businessValue",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Público-alvo",
              name: "targetMarket",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Benchmarkings",
              name: "benchmarkings",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Legalidades",
              name: "legalIssues",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Questões éticas",
              name: "ethicalIssues",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Pós-venda",
              name: "afterSales",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Monetização",
              name: "monetization",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
          ],
        },
        {
          id: "projectFilesTab",
          title: "Arquivos do projeto",
          elements: [
            {
              label: "Adicionar arquivo do projeto",
              name: "projectsFiles",
              type: "array",
              elements: [
                {
                  label: "Nome do arquivo",
                  name: "fileName",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  isRequired: true,
                },
                {
                  label: "Descrição do arquivo",
                  name: "fileDescription",
                  type: "input",
                  dataType: EDataType.WYSIWYG,
                },
                {
                  label: "Arquivo do projeto",
                  name: "fileUrl",
                  dataType: EDataType.NVARCHAR,
                  type: "file",
                  storageConfig: {
                    fileNameStrategy: "uuid",
                    path: "projects/files",
                    visibility: "private",
                  },
                },
              ],
            },
          ],
        },
        {
          title: "Links relacionados",
          id: "softwareDevelopmentLinksTab",
          elements: [
            {
              type: "array",
              name: "relatedLinks",
              label: "Link relacionado",
              elements: [
                {
                  label: "Link",
                  name: "relatedLink",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  isRequired: true,
                },
                {
                  label: "Descrição",
                  name: "relatedLinkDescription",
                  type: "input",
                  dataType: EDataType.WYSIWYG,
                },
              ],
            }
          ],
        },
      ],
    },
  ],
  contracts: [
    {
      id: "projects",
      endpoint: "/projects",
      actions: ["create", "update", "get", "getById", "softDelete"],
      request: {
        entity: "projects",
        fields: [],
      },
    },
  ],
};
