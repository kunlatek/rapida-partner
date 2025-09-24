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
      body: [
        { name: "country", dataType: EFormContractDataType.TEXT },
        { name: "cpf", dataType: EFormContractDataType.TEXT },
        { name: "passport", dataType: EFormContractDataType.TEXT },
        { name: "passportIssueDate", dataType: EFormContractDataType.DATE },
        { name: "passportExpiryDate", dataType: EFormContractDataType.DATE },
        { name: "name", dataType: EFormContractDataType.TEXT },
        { name: "gender", dataType: EFormContractDataType.TEXT },
        { name: "birthday", dataType: EFormContractDataType.DATE },
        { name: "picture", dataType: EFormContractDataType.TEXT },
        { name: "phoneOne", dataType: EFormContractDataType.TEXT },
        { name: "emailOne", dataType: EFormContractDataType.EMAIL },
        { name: "addressOneZipCode", dataType: EFormContractDataType.TEXT },
        { name: "addressOneStreet", dataType: EFormContractDataType.TEXT },
        { name: "addressOneDistrict", dataType: EFormContractDataType.TEXT },
        { name: "addressOneNumber", dataType: EFormContractDataType.TEXT },
        { name: "addressOneComplement", dataType: EFormContractDataType.TEXT },
        { name: "addressOneCity", dataType: EFormContractDataType.TEXT },
        { name: "addressOneState", dataType: EFormContractDataType.TEXT },
        { name: "addressOneLatitude", dataType: EFormContractDataType.TEXT },
        { name: "addressOneLongitude", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoZipCode", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoStreet", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoDistrict", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoNumber", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoComplement", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoCity", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoState", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoLatitude", dataType: EFormContractDataType.TEXT },
        { name: "addressTwoLongitude", dataType: EFormContractDataType.TEXT },
        { name: "phoneTwo", dataType: EFormContractDataType.TEXT },
        { name: "emailTwo", dataType: EFormContractDataType.EMAIL },
        { name: "siteOne", dataType: EFormContractDataType.TEXT },
        { name: "siteTwo", dataType: EFormContractDataType.TEXT },
        { name: "linkedin", dataType: EFormContractDataType.TEXT },
        { name: "instagram", dataType: EFormContractDataType.TEXT },
        { name: "facebook", dataType: EFormContractDataType.TEXT },
        { name: "nickname", dataType: EFormContractDataType.TEXT },
        { name: "personDescription", dataType: EFormContractDataType.WYSIWYG },
        { name: "personMaritalStatus", dataType: EFormContractDataType.TEXT },
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