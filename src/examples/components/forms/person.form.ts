import { COUNTRIES_FROM_EARTH } from "../../../constants/options/countriesFromEarth";
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
      body: [
        { name: "country", dataType: "text" },
        { name: "cpf", dataType: "text" },
        { name: "passport", dataType: "text" },
        { name: "passportIssueDate", dataType: "date" },
        { name: "passportExpiryDate", dataType: "date" },
        { name: "name", dataType: "text" },
        { name: "gender", dataType: "text" },
        { name: "birthday", dataType: "date" },
        { name: "picture", dataType: "text" },
        { name: "phoneOne", dataType: "text" },
        { name: "emailOne", dataType: "email" },
        { name: "addressOneZipCode", dataType: "text" },
        { name: "addressOneStreet", dataType: "text" },
        { name: "addressOneDistrict", dataType: "text" },
        { name: "addressOneNumber", dataType: "text" },
        { name: "addressOneComplement", dataType: "text" },
        { name: "addressOneCity", dataType: "text" },
        { name: "addressOneState", dataType: "text" },
        { name: "addressOneLatitude", dataType: "text" },
        { name: "addressOneLongitude", dataType: "text" },
        { name: "addressTwoZipCode", dataType: "text" },
        { name: "addressTwoStreet", dataType: "text" },
        { name: "addressTwoDistrict", dataType: "text" },
        { name: "addressTwoNumber", dataType: "text" },
        { name: "addressTwoComplement", dataType: "text" },
        { name: "addressTwoCity", dataType: "text" },
        { name: "addressTwoState", dataType: "text" },
        { name: "addressTwoLatitude", dataType: "text" },
        { name: "addressTwoLongitude", dataType: "text" },
        { name: "phoneTwo", dataType: "text" },
        { name: "emailTwo", dataType: "email" },
        { name: "siteOne", dataType: "text" },
        { name: "siteTwo", dataType: "text" },
        { name: "linkedin", dataType: "text" },
        { name: "instagram", dataType: "text" },
        { name: "facebook", dataType: "text" },
        { name: "nickname", dataType: "text" },
        { name: "personDescription", dataType: "wysiwyg" },
        { name: "personMaritalStatus", dataType: "text" },
      ]
    }
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
              dataType: "text",
              options: COUNTRIES_FROM_EARTH.map(country => ({ label: country.brazilianPortugueseName, value: country.englishNameAsValue })),
              isRequired: true,
            },
            {
              label: "CPF",
              type: "input",
              dataType: "text",
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
              dataType: "text",
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
              dataType: "date",
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
              dataType: "date",
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
              dataType: "text",
              name: "name",
              isRequired: true,
            },
            {
              label: "Gênero",
              type: "select",
              dataType: "text",
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
              dataType: "date",
              name: "birthday",
            },
            {
              label: "Foto da pessoa",
              type: "file",
              dataType: "text",
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
              dataType: "text",
              name: "phoneOne",
              validators: ["phone"],
              isRequired: true,
            },
            {
              label: "E-mail principal",
              type: "input",
              dataType: "email",
              name: "emailOne",
              isRequired: true,
            },
            // {
            //   label: "Relacionamentos",
            //   type: "select",
            //   dataType: "text",
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
                  dataType: "text",
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
                  dataType: "text",
                  name: "addressOneStreet",
                }, 
                {
                  label: "Bairro",
                  type: "input",
                  dataType: "text",
                  name: "addressOneDistrict",
                }, 
                {
                  label: "Número",
                  type: "input",
                  dataType: "text",
                  name: "addressOneNumber",
                }, 
                {
                  label: "Complemento",
                  type: "input",
                  dataType: "text",
                  name: "addressOneComplement",
                }, {
                  label: "Cidade",
                  type: "input",
                  dataType: "text",
                  name: "addressOneCity",
                }, 
                {
                  label: "Estado",
                  type: "input",
                  dataType: "text",
                  name: "addressOneState",
                }, 
                {
                  label: "Latitude",
                  type: "input",
                  dataType: "text",
                  name: "addressOneLatitude",
                }, 
                {
                  label: "Longitude",
                  type: "input",
                  dataType: "text",
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
                  dataType: "text",
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
                  dataType: "text",
                  name: "addressTwoStreet",
                }, 
                {
                  label: "Bairro",
                  type: "input",
                  dataType: "text",
                  name: "addressTwoDistrict",
                }, 
                {
                  label: "Número",
                  type: "input",
                  dataType: "text",
                  name: "addressTwoNumber",
                }, 
                {
                  label: "Complemento",
                  type: "input",
                  dataType: "text",
                  name: "addressTwoComplement",
                }, {
                  label: "Cidade",
                  type: "input",
                  dataType: "text",
                  name: "addressTwoCity",
                }, 
                {
                  label: "Estado",
                  type: "input",
                  dataType: "text",
                  name: "addressTwoState",
                }, 
                {
                  label: "Latitude",
                  type: "input",
                  dataType: "text",
                  name: "addressTwoLatitude",
                }, 
                {
                  label: "Longitude",
                  type: "input",
                  dataType: "text",
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
              dataType: "text",
              name: "phoneTwo",
              validators: ["phone"],
            },
            {
              label: "E-mail secundário",
              type: "input",
              dataType: "email",
              name: "emailTwo",
            },
            {
              label: "Site 1",
              type: "input",
              dataType: "text",
              name: "siteOne",
            },
            {
              label: "Site 2",
              type: "input",
              dataType: "text",
              name: "siteTwo",
            },
            {
              label: "Linkedin",
              type: "input",
              dataType: "text",
              name: "linkedin",
            },
            {
              label: "Instagram",
              type: "input",
              dataType: "text",
              name: "instagram",
            },
            {
              label: "Facebook",
              type: "input",
              dataType: "text",
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
              dataType: "text",
              name: "nickname",
            }, 
            {
              label: "Descrição da pessoa",
              type: "input",
              dataType: "wysiwyg",
              name: "personDescription",
            }, 
            {
              label: "Estado civil",
              type: "select",
              dataType: "text",
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