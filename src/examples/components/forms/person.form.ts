import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";
import { COUNTRIES_FROM_EARTH } from "../../constants/options/countriesFromEarth";

export const personForm: IForm = {
  title: "Gerenciar pessoa",
  componentType: "form",
  id: "personForm",
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
              dataType: EDataType.NVARCHAR,
              options: COUNTRIES_FROM_EARTH.map((country) => ({
                label: country.originalName,
                value: country.englishNameAsValue,
                isSelected: country.englishNameAsValue === "brazil",
              })),
              isRequired: true,
              space: 2,
            },
            {
              label: "CPF",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "cpf",
              validators: ["cpf"],
              isUnique: true,
              maskRegex: "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$",
              space: 2,
              conditions: {
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
              label: "Arquivo de CPF",
              type: "file",
              name: "cpfFile",
              dataType: EDataType.NVARCHAR,
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "person/documents",
                visibility: "public",
              },
              space: 4,
              conditions: {
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
              label: "Nome completo",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "name",
              isRequired: true,
              space: 4,
            },
            {
              label: "Gênero",
              type: "select",
              dataType: EDataType.NVARCHAR,
              name: "gender",
              options: [
                { label: "Masculino", value: "male" },
                { label: "Feminino", value: "female" },
                { label: "Outro", value: "other" },
              ],
              space: 1,
            },
            {
              label: "Data de nascimento",
              type: "input",
              dataType: EDataType.DATETIME2,
              name: "birthday",
              space: 1,
            },
            {
              label: "Estado civil",
              type: "select",
              dataType: EDataType.NVARCHAR,
              name: "maritalStatus",
              options: [
                { label: "Solteiro", value: "single" },
                { label: "Casado", value: "married" },
                { label: "Divorciado", value: "divorced" },
                { label: "Viúvo", value: "widower" },
                { label: "Noivo", value: "engaged" },
                { label: "União estável", value: "stableUnion" },
              ],
              space: 2,
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
                  options: COUNTRIES_FROM_EARTH.map((country) => ({
                    label: country.countryCode,
                    value: country.countryCode,
                    isSelected: country.countryCode === "+55",
                  })),
                  space: 1,
                },
                {
                  label: "Telefone",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "phoneOne",
                  maskRegex: "^\\d{15}$",
                  space: 3,
                },
              ],
            },
            {
              label: "E-mail principal",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "emailOne",
              space: 4,
            },
          ],
        },
        {
          id: "addressTab",
          title: "Endereços",
          elements: [
            {
              title: "Endereço principal",
              id: "mainAddress",
              type: "fieldset",
              elements: [
                {
                  label: "CEP",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressZipCode",
                  apiRequest: {
                    endpoint: "https://brasilapi.com.br/api/cep/v1/",
                    paramType: "path",
                    formFieldsFilledByApiResponse: [
                      {
                        formFieldName: "mainAddressStreet",
                        propertiesFromApiToFillFormField: ["street"],
                      },
                      {
                        formFieldName: "mainAddressDistrict",
                        propertiesFromApiToFillFormField: ["neighborhood"],
                      },
                      {
                        formFieldName: "mainAddressCity",
                        propertiesFromApiToFillFormField: ["city"],
                      },
                      {
                        formFieldName: "mainAddressState",
                        propertiesFromApiToFillFormField: ["state"],
                      },
                    ],
                    conditions: {
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
                  validators: ["cep"],
                  space: 1,
                },
                {
                  label: "Logradouro",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressStreet",
                  space: 2,
                },
                {
                  label: "Número",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressNumber",
                  space: 1,
                },
                {
                  label: "Bairro",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressDistrict",
                  space: 2,
                },
                {
                  label: "Complemento",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressComplement",
                  space: 2,
                },
                {
                  label: "Cidade",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressCity",
                  space: 1,
                },
                {
                  label: "Estado",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressState",
                  space: 1,
                },
                {
                  label: "Latitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressLatitude",
                  space: 1,
                },
                {
                  label: "Longitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "mainAddressLongitude",
                  space: 1,
                },
              ],
            },
            {
              title: "Outro endereço",
              type: "fieldset",
              id: "otherAddress",
              elements: [
                {
                  label: "CEP",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressZipCode",
                  apiRequest: {
                    endpoint: "https://brasilapi.com.br/api/cep/v1/",
                    paramType: "path",
                    formFieldsFilledByApiResponse: [
                      {
                        formFieldName: "otherAddressStreet",
                        propertiesFromApiToFillFormField: ["street"],
                      },
                      {
                        formFieldName: "otherAddressDistrict",
                        propertiesFromApiToFillFormField: ["neighborhood"],
                      },
                      {
                        formFieldName: "otherAddressCity",
                        propertiesFromApiToFillFormField: ["city"],
                      },
                      {
                        formFieldName: "otherAddressState",
                        propertiesFromApiToFillFormField: ["state"],
                      },
                    ],
                  },
                  validators: ["cep"],
                  space: 1,
                },
                {
                  label: "Logradouro",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressStreet",
                  space: 2,
                },
                {
                  label: "Número",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressNumber",
                  space: 1,
                },
                {
                  label: "Bairro",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressDistrict",
                  space: 2,
                },
                {
                  label: "Complemento",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressComplement",
                  space: 2,
                },
                {
                  label: "Cidade",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressCity",
                  space: 1,
                },
                {
                  label: "Estado",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressState",
                  space: 1,
                },
                {
                  label: "Latitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressLatitude",
                  space: 1,
                },
                {
                  label: "Longitude",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "otherAddressLongitude",
                  space: 1,
                },
              ],
            },
          ],
        },
        {
          id: "personContactTab",
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
                  options: COUNTRIES_FROM_EARTH.map((country) => ({
                    label: country.countryCode,
                    value: country.countryCode,
                    isSelected: country.countryCode === "+55",
                  })),
                  space: 2,
                },
                {
                  label: "Telefone",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "phoneTwo",
                  maskRegex: "^\\d{15}$",
                  space: 2,
                },
              ],
            },
            {
              label: "E-mail secundário",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "emailTwo",
              space: 1,
            },
            {
              label: "Site 1",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "siteOne",
              space: 2,
            },
            {
              label: "Site 2",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "siteTwo",
              space: 2,
            },
            {
              label: "Linkedin",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "linkedin",
              space: 1,
            },
            {
              label: "Instagram",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "instagram",
              space: 1,
            },
            {
              label: "Facebook",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "facebook",
              space: 1,
            },
          ],
        },
        {
          id: "documentationTab",
          title: "Documentações",
          elements: [
            {
              title: "RG",
              type: "fieldset",
              id: "rgFieldset",
              elements: [
                {
                  label: "RG",
                  name: "rg",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  space: 2,
                },
                {
                  label: "Data de emissão do RG",
                  name: "rgIssueDate",
                  type: "input",
                  dataType: EDataType.DATETIME2,
                  space: 1,
                },
                {
                  label: "Data de validade do RG",
                  name: "rgExpiryDate",
                  type: "input",
                  dataType: EDataType.DATETIME2,
                  space: 1,
                },
                {
                  label: "Arquivo do RG",
                  name: "rgFile",
                  type: "file",
                  dataType: EDataType.NVARCHAR,
                  storageConfig: {
                    fileNameStrategy: "uuid",
                    path: "person/documents",
                    visibility: "public",
                  },
                  space: 4,
                },
              ],
            },
            {
              title: "Passaporte",
              type: "fieldset",
              id: "passportFieldset",
              elements: [
                {
                  label: "Passaporte",
                  type: "input",
                  dataType: EDataType.NVARCHAR,
                  name: "passport",
                  isUnique: true,
                  space: 2,
                },
                {
                  label: "Data de emissão do passaporte",
                  type: "input",
                  dataType: EDataType.DATETIME2,
                  name: "passportIssueDate",
                  space: 1,
                },
                {
                  label: "Data de validade do passaporte",
                  type: "input",
                  dataType: EDataType.DATETIME2,
                  name: "passportExpiryDate",
                  space: 1,
                },
                {
                  label: "Arquivo do passaporte",
                  name: "passportFile",
                  type: "file",
                  dataType: EDataType.NVARCHAR,
                  storageConfig: {
                    fileNameStrategy: "uuid",
                    path: "person/documents",
                    visibility: "public",
                  },
                  space: 4,
                },
              ],
            },
          ],
        },
        {
          id: "moreDetailsTab",
          title: "Outros dados",
          elements: [
            {
              label: "Foto da pessoa",
              type: "file",
              dataType: EDataType.NVARCHAR,
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "person/pictures",
                visibility: "public",
              },
              name: "pictureUrl",
              space: 4,
            },
            {
              label: "Nome social",
              type: "input",
              dataType: EDataType.NVARCHAR,
              name: "nickname",
              space: 4,
            },
            {
              label: "Descrição da pessoa",
              type: "input",
              dataType: EDataType.LONGTEXT,
              name: "personDescription",
              space: 4,
            },
          ],
        },
      ],
    },
  ],
  contracts: [
    {
      id: "people",
      endpoint: "/people",
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: {
        entity: "people",
        fields: [],
      },
    },
  ],
};
