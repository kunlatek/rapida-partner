import { COUNTRIES_FROM_EARTH } from "../../../constants/options/countriesFromEarth";
import { EFormContractDataType } from "../../../enums/form-contract.enum";
import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const personForm: IForm = {
  title: "Gerenciamento de cliente pessoa",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de pessoa para inserir e editar informações de clientes, incluindo dados principais (como nome, nacionalidade, CPF, data de nascimento, gênero, foto, telefones e e-mails), contatos e redes sociais (como telefones secundários, e-mails e links de sites), e endereços, para que eu possa manter um registro completo e atualizado das pessoas no sistema.`,
  componentType: "form",
  id: "personForm",
  contracts: [{
    endpoint: "/people",
    methods: [{ verb: "GET" }, { verb: "POST" }, { verb: "PUT" }, { verb: "DELETE" }],
    request: {
      entity: "People",
      description: "Represents an individual person with personal details and contact information.",
      fields: [
        { name: "_id", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
        { name: "country", dataType: EFormContractDataType.NVARCHAR, isRequired: true, maxSize: 100 },
        { name: "cpf", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 14 },
        { name: "passport", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 20 },
        { name: "passportIssueDate", dataType: EFormContractDataType.DATETIME2, isRequired: false },
        { name: "passportExpiryDate", dataType: EFormContractDataType.DATETIME2, isRequired: false },
        { name: "name", dataType: EFormContractDataType.NVARCHAR, isRequired: true, maxSize: 200 },
        { name: "gender", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 10, enum: ["male", "female", "other"] },
        { name: "birthday", dataType: EFormContractDataType.DATETIME2, isRequired: false },
        { name: "picture", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "phoneOne", dataType: EFormContractDataType.NVARCHAR, isRequired: true, maxSize: 20 },
        { name: "emailOne", dataType: EFormContractDataType.NVARCHAR, isRequired: true, maxSize: 100 },
        { name: "addressOneZipCode", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 10 },
        { name: "addressOneStreet", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "addressOneDistrict", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressOneNumber", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 20 },
        { name: "addressOneComplement", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressOneCity", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressOneState", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressOneLatitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 50 },
        { name: "addressOneLongitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 50 },
        { name: "addressTwoZipCode", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 10 },
        { name: "addressTwoStreet", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "addressTwoDistrict", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressTwoNumber", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 20 },
        { name: "addressTwoComplement", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressTwoCity", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressTwoState", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "addressTwoLatitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 50 },
        { name: "addressTwoLongitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 50 },
        { name: "phoneTwo", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 20 },
        { name: "emailTwo", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "siteOne", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "siteTwo", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "linkedin", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "instagram", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "facebook", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 200 },
        { name: "nickname", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 100 },
        { name: "personDescription", dataType: EFormContractDataType.LONGTEXT, isRequired: false },
        { name: "personMaritalStatus", dataType: EFormContractDataType.NVARCHAR, isRequired: false, maxSize: 20, enum: ["single", "married", "divorced", "widower", "engaged", "stableUnion"] },
      ]
    },
  }],
  guards: "isAuthorized",
  elements: [
    {
      id: "personTab",
      type: "tab",
      tabs: [
        {
          id: "personMainDataTab",
          title: "Dados principais",
          elements: [
            {
              label: "Nacionalidade",
              type: "select",
              name: "country",
              dataType: EDataType.TEXT,
              options: COUNTRIES_FROM_EARTH.map(country => ({ label: country.brazilianPortugueseName, value: country.englishNameAsValue })),
              isRequired: true,
            },
            {
              label: "CPF",
              type: "input",
              dataType: EDataType.TEXT,
              name: "cpf",
              validators: ["cpf"],
              isUnique: true,
              conditions: [
                {
                  type: "form",
                  elements: [
                    {
                      key: "country",
                      value: "brazilian",
                      comparisonOperator: "===",
                    }
                  ]
                },
              ]
            },
            {
              label: "Passaporte",
              type: "input",
              dataType: EDataType.TEXT,
              name: "passport",
              isUnique: true,
              conditions: [
                {
                  type: "form",
                  elements: [
                    {
                      key: "country",
                      value: "brazilian",
                      comparisonOperator: "!==",
                    }
                  ]
                },
              ]
            },
            {
              label: "Data de emissão do passaporte",
              type: "input",
              dataType: EDataType.DATE,
              name: "passportIssueDate",
              conditions: [
                {
                  type: "form",
                  elements: [
                    {
                      key: "country",
                      value: "brazilian",
                      comparisonOperator: "!==",
                    }
                  ]
                },
              ],
            },
            {
              label: "Data de validade do passaporte",
              type: "input",
              dataType: EDataType.DATE,
              name: "passportExpiryDate",
              conditions: [
                {
                  type: "form",
                  elements: [
                    {
                      key: "country",
                      value: "brazilian",
                      comparisonOperator: "!==",
                    }
                  ]
                },
              ],
            },
            {
              label: "Nome completo",
              type: "input",
              dataType: EDataType.TEXT,
              name: "name",
              isRequired: true,
            },
            {
              label: "Gênero",
              type: "select",
              dataType: EDataType.TEXT,
              name: "gender",
              options: [
                { label: "Masculino", value: "m" },
                { label: "Feminino", value: "f" },
                { label: "Outro", value: "o" },
              ],
            },
            {
              label: "Data de nascimento",
              type: "input",
              dataType: EDataType.DATE,
              name: "birthday",
            },
            {
              label: "Foto da pessoa",
              type: "file",
              dataType: EDataType.TEXT,
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "person/pictures",
                visibility: "public",
              },
              name: "picture",
            },
            {
              label: "Telefone principal",
              type: "input",
              dataType: EDataType.TEXT,
              name: "phoneOne",
              validators: ["phone"],
              isRequired: true,
            },
            {
              label: "E-mail principal",
              type: "input",
              dataType: EDataType.EMAIL,
              name: "emailOne",
              isRequired: true,
            },
            // {
            //   label: "Relacionamentos",
            //   type: "select",
            //   dataType: EDataType.TEXT,
            //   name: "relationships",
            //   options: [
            //     {
            //       label: "Cliente",
            //       value: "customer",
            //     },
            //     {
            //       label: "Fornecedor",
            //       value: "supplier",
            //     },
            //   ],
            //   isMultiple: true,
            // },
          ],
        },
        {
          id: "personAddressTab",
          title: "Endereços",
          elements: [
            {
              type: "fieldset",
              id: "addressOne",
              title: "Endereço 1",
              elements: [
                {
                  label: "CEP",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneZipCode",
                  apiRequest: {
                    endpoint: "https://brasilapi.com.br/api/cep/v1/",
                    paramType: "path",
                    formFieldsFilledByApiResponse: [
                      {
                        formFieldName: "addressOneStreet",
                        propertiesFromApiToFillFormField: ["street"]
                      },
                      {
                        formFieldName: "addressOneDistrict",
                        propertiesFromApiToFillFormField: ["neighborhood"]
                      },
                      {
                        formFieldName: "addressOneCity",
                        propertiesFromApiToFillFormField: ["city"]
                      },
                      {
                        formFieldName: "addressOneState",
                        propertiesFromApiToFillFormField: ["state"]
                      },
                    ],
                  },
                  validators: ["cep"],
                }, 
                {
                  label: "Logradouro",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneStreet",
                }, 
                {
                  label: "Bairro",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneDistrict",
                }, 
                {
                  label: "Número",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneNumber",
                }, 
                {
                  label: "Complemento",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneComplement",
                }, {
                  label: "Cidade",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneCity",
                }, 
                {
                  label: "Estado",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneState",
                }, 
                {
                  label: "Latitude",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneLatitude",
                }, 
                {
                  label: "Longitude",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneLongitude",
                }
              ],
            }, 
            {
              title: "Endereço 2",
              type: "fieldset",
              id: "addressTwo",
              elements: [
                {
                  label: "CEP",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoZipCode",
                  apiRequest: {
                    endpoint: "https://brasilapi.com.br/api/cep/v1/",
                    paramType: "path",
                    formFieldsFilledByApiResponse: [
                      {
                        formFieldName: "addressTwoStreet",
                        propertiesFromApiToFillFormField: ["street"]
                      },
                      {
                        formFieldName: "addressTwoDistrict",
                        propertiesFromApiToFillFormField: ["neighborhood"]
                      },
                      {
                        formFieldName: "addressTwoCity",
                        propertiesFromApiToFillFormField: ["city"]
                      },
                      {
                        formFieldName: "addressTwoState",
                        propertiesFromApiToFillFormField: ["state"]
                      },
                    ],
                  },
                  validators: ["cep"],
                }, 
                {
                  label: "Logradouro",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoStreet",
                }, 
                {
                  label: "Bairro",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoDistrict",
                }, 
                {
                  label: "Número",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoNumber",
                }, 
                {
                  label: "Complemento",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoComplement",
                }, {
                  label: "Cidade",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoCity",
                }, 
                {
                  label: "Estado",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoState",
                }, 
                {
                  label: "Latitude",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoLatitude",
                }, 
                {
                  label: "Longitude",
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressTwoLongitude",
                }
              ],
            }, 
          ],
        },
        {
          id: "personContactTab",
          title: "Contatos e redes",
          elements: [
            {
              label: "Telefone secundário",
              type: "input",
              dataType: EDataType.TEXT,
              name: "phoneTwo",
              validators: ["phone"],
            },
            {
              label: "E-mail secundário",
              type: "input",
              dataType: EDataType.EMAIL,
              name: "emailTwo",
            },
            {
              label: "Site 1",
              type: "input",
              dataType: EDataType.TEXT,
              name: "siteOne",
            },
            {
              label: "Site 2",
              type: "input",
              dataType: EDataType.TEXT,
              name: "siteTwo",
            },
            {
              label: "Linkedin",
              type: "input",
              dataType: EDataType.TEXT,
              name: "linkedin",
            },
            {
              label: "Instagram",
              type: "input",
              dataType: EDataType.TEXT,
              name: "instagram",
            },
            {
              label: "Facebook",
              type: "input",
              dataType: EDataType.TEXT,
              name: "facebook",
            },
          ],
        },
        {
          id: "moreDetailsTab",
          title: "Outros dados",
          elements: [
            {
              label: "Nome social",
              type: "input",
              dataType: EDataType.TEXT,
              name: "nickname",
            }, 
            {
              label: "Descrição da pessoa",
              type: "input",
              dataType: EDataType.WYSIWYG,
              name: "personDescription",
            }, 
            {
              label: "Estado civil",
              type: "select",
              dataType: EDataType.TEXT,
              name: "personMaritalStatus",
              options: [
                { label: "Solteiro", value: "single" },
                { label: "Casado", value: "married" },
                { label: "Divorciado", value: "divorced" },
                { label: "Viúvo", value: "widower" },
                { label: "Noivo", value: "engaged" },
                { label: "União estável", value: "stableUnion" },
              ],
            },
          ],
        },
      ],
    }
  ],
};