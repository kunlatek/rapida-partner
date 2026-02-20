import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";
import { COUNTRIES_FROM_EARTH } from "../../constants/options/countriesFromEarth";
import { LEGAL_NATURE } from "../../constants/options/legalNature";

export const companyForm: IForm = {
  title: "Gerenciamento de empresa",
  componentType: "form",
  id: "companyForm",
  guards: "isAuthorized",
  elements: [
    {
      type: "tab",
      id: "companyTab",
      tabs: [
        {
          id: "companyMainDataTab",
          title: "Dados principais",
          elements: [
            {
              label: "Nacionalidade",
              name: "country",
              type: "select",
              dataType: EDataType.NVARCHAR,
              options: COUNTRIES_FROM_EARTH.map((country) => ({
                label: country.originalName,
                value: country.englishNameAsValue,
                isSelected: country.englishNameAsValue === "brazil",
              })),
              isRequired: true,
            },
            {
              label: "CNPJ",
              name: "cnpj",
              type: "input",
              dataType: EDataType.NVARCHAR,
              maskRegex: "^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$",
              isUnique: true,
              conditions:
              {
                form: {
                  elements: [
                    {
                      key: "country",
                      value: "brazil",
                      comparisonOperator: "===",
                    },
                  ],
                },
              },
            },
            {
              label: "Razão social",
              name: "name",
              type: "input",
              dataType: EDataType.NVARCHAR,
              isRequired: true,
            },
            {
              label: "Nome fantasia",
              name: "businessName",
              type: "input",
              dataType: EDataType.NVARCHAR,
            },
            {
              label: "Data de abertura",
              name: "birthday",
              type: "input",
              dataType: EDataType.DATETIME2,
            },
            {
              label: "Natureza legal",
              name: "legalNature",
              type: "select",
              dataType: EDataType.NVARCHAR,
              options: LEGAL_NATURE.map((nature) => nature),
              conditions:
              {
                form: {
                  elements: [
                    {
                      key: "country",
                      value: "brazil",
                      comparisonOperator: "===",
                    },
                  ],
                },
              },
            },
            // input - Inscrição estadual
            {
              label: "Inscrição estadual",
              name: "stateRegistration",
              type: "input",
              dataType: EDataType.NVARCHAR,
              conditions:
              {
                form: {
                  elements: [
                    {
                      key: "country",
                      value: "brazil",
                      comparisonOperator: "===",
                    },
                  ],
                },
              },
              validators: ["onlyNumbers"],
            },
            // input - Inscrição municipal
            {
              label: "Inscrição municipal",
              name: "municipalRegistration",
              type: "input",
              dataType: EDataType.NVARCHAR,
              conditions:
              {
                form: {
                  elements: [
                    {
                      key: "country",
                      value: "brazil",
                      comparisonOperator: "===",
                    },
                  ],
                },
              },
            },
            {
              label: "Descrição da empresa",
              name: "description",
              type: "input",
              dataType: EDataType.WYSIWYG,
            },
            {
              label: "Logo da empresa",
              name: "logo",
              type: "file",
              dataType: EDataType.NVARCHAR,
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "company/logos",
                visibility: "public",
              },
            },
            {
              label: "Sócios",
              name: "companyPartnersId",
              type: "autocomplete",
              dataType: EDataType.NVARCHAR,
              tooltip:
                "O(s) sócio(s) deve(m) estar cadastrado(s) no gerenciamento de pessoas.",
              optionsApi: {
                endpoint: "/people",
                labelField: ["cpf", "name"],
                valueField: "_id",
                paramsToFilter: ["cpf", "name"],
                paramType: "query",
                relatedEntity: "people",
              },
              isMultiple: true,
            },
            {
              title: "Telefone principal",
              type: "fieldset",
              id: "phoneOneFieldset",
              elements: [
                {
                  label: "DDI",
                  type: "select",
                  dataType: EDataType.NVARCHAR,
                  name: "phoneOneDdi",
                  options: COUNTRIES_FROM_EARTH.map(country => ({
                    label: country.countryCode,
                    value: country.countryCode,
                    isSelected: country.countryCode === "+55"
                  })),
                },
                {
                  label: "Telefone",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "phoneOne",
                  maskRegex: "^\\d{15}$",
                },
              ]
            },
            {
              label: "E-mail principal",
              name: "emailOne",
              type: "input",
              dataType: EDataType.EMAIL,
              isRequired: true,
            },
          ],
        },
        {
          id: "companyAddressTab",
          title: "Endereços",
          elements: [
            {
              type: "fieldset",
              id: "addressOne",
              title: "Endereço 1",
              elements: [
                {
                  label: "CEP",
                  name: "addressOneZipCode",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  apiRequest: {
                    endpoint: "https://brasilapi.com.br/api/cep/v1/",
                    paramType: "path",
                    formFieldsFilledByApiResponse: [
                      {
                        formFieldName: "addressOneStreet",
                        propertiesFromApiToFillFormField: ["street"],
                      },
                      {
                        formFieldName: "addressOneDistrict",
                        propertiesFromApiToFillFormField: ["neighborhood"],
                      },
                      {
                        formFieldName: "addressOneCity",
                        propertiesFromApiToFillFormField: ["city"],
                      },
                      {
                        formFieldName: "addressOneState",
                        propertiesFromApiToFillFormField: ["state"],
                      },
                    ],
                  },
                  validators: ["cep"],
                },
                {
                  label: "Logradouro",
                  name: "addressOneStreet",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Bairro",
                  name: "addressOneDistrict",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Número",
                  name: "addressOneNumber",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Complemento",
                  name: "addressOneComplement",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Cidade",
                  name: "addressOneCity",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Estado",
                  name: "addressOneState",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Latitude",
                  name: "addressOneLatitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Longitude",
                  name: "addressOneLongitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
              ],
            },
            {
              title: "Endereço 2",
              type: "fieldset",
              id: "addressTwo",
              elements: [
                {
                  label: "CEP",
                  name: "addressTwoZipCode",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  apiRequest: {
                    endpoint: "https://brasilapi.com.br/api/cep/v1/",
                    paramType: "path",
                    formFieldsFilledByApiResponse: [
                      {
                        formFieldName: "addressTwoStreet",
                        propertiesFromApiToFillFormField: ["street"],
                      },
                      {
                        formFieldName: "addressTwoDistrict",
                        propertiesFromApiToFillFormField: ["neighborhood"],
                      },
                      {
                        formFieldName: "addressTwoCity",
                        propertiesFromApiToFillFormField: ["city"],
                      },
                      {
                        formFieldName: "addressTwoState",
                        propertiesFromApiToFillFormField: ["state"],
                      },
                    ],
                  },
                  validators: ["cep"],
                },
                {
                  label: "Logradouro",
                  name: "addressTwoStreet",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Bairro",
                  name: "addressTwoDistrict",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Número",
                  name: "addressTwoNumber",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Complemento",
                  name: "addressTwoComplement",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Cidade",
                  name: "addressTwoCity",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Estado",
                  name: "addressTwoState",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Latitude",
                  name: "addressTwoLatitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
                {
                  label: "Longitude",
                  name: "addressTwoLongitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                },
              ],
            },
          ],
        },
        {
          id: "companyContactTab",
          title: "Contatos e redes",
          elements: [
            {
              title: "Telefone secundário",
              type: "fieldset",
              id: "phoneTwoFieldset",
              elements: [
                {
                  label: "DDI",
                  type: "select",
                  dataType: EDataType.NVARCHAR,
                  name: "phoneTwoDdi",
                  options: COUNTRIES_FROM_EARTH.map(country => ({
                    label: country.countryCode,
                    value: country.countryCode,
                    isSelected: country.countryCode === "+55"
                  })),
                },
                {
                  label: "Telefone",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "phoneTwo",
                  maskRegex: "^\\d{15}$",
                },
              ]
            },
            {
              label: "E-mail secundário",
              name: "emailTwo",
              type: "input",
              dataType: EDataType.EMAIL,
            },
            {
              label: "Site 1",
              name: "siteOne",
              type: "input",
              dataType: EDataType.NVARCHAR,
            },
            {
              label: "Site 2",
              name: "siteTwo",
              type: "input",
              dataType: EDataType.NVARCHAR,
            },
            {
              label: "Linkedin",
              name: "linkedin",
              type: "input",
              dataType: EDataType.NVARCHAR,
            },
            {
              label: "Instagram",
              name: "instagram",
              type: "input",
              dataType: EDataType.NVARCHAR,
            },
            {
              label: "Facebook",
              name: "facebook",
              type: "input",
              dataType: EDataType.NVARCHAR,
            },
            {
              label: "Whatsapp Id",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "lid",
            },
          ],
        },
      ],
    },
  ],
  contracts: [
    {
      id: "companies",
      endpoint: "/companies",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "companies",
        fields: [],
      },
    }
  ],
};
