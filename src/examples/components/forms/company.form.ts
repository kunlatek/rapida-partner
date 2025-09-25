import { COUNTRIES_FROM_EARTH } from "../../../constants/options/countriesFromEarth";
import { EFormContractDataType } from "../../../enums/form-contract.enum";
import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";

export const companyForm: IForm = {
  title: "Gerenciamento de empresa",
  userStory: `Como um usuário autorizado, eu quero usar o formulário de gerenciamento de empresas para criar e editar registros de empresas, incluindo dados principais como razão social, nome fantasia, CNPJ, nacionalidade, data de abertura, natureza legal e descrição. Eu também quero gerenciar informações de contato e redes sociais, como telefones e e-mails, e até dois endereços completos, para que eu possa manter um cadastro detalhado e atualizado das empresas. Além disso, quero poder associar sócios cadastrados no gerenciamento de pessoas à empresa, para manter um registro de quem são os responsáveis.`,
  componentType: "form",
  id: "companyForm",
  contracts: [{
    endpoint: "/companies",
    methods: [{ verb: "POST" }, { verb: "PUT" }, { verb: "GET" }, { verb: "DELETE" }],
    request: {
      entity: "Companies",
      description: "Represents a company or business entity.",
      fields: [
        { name: "_id", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: true, isPrimaryKey: true },
        { name: "country", dataType: EFormContractDataType.NVARCHAR, isRequired: true },
        { name: "cnpj", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "name", dataType: EFormContractDataType.NVARCHAR, isRequired: true },
        { name: "businessName", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "birthday", dataType: EFormContractDataType.DATE, isRequired: false },
        { name: "legalNature", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "stateRegistration", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "municipalRegistration", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "description", dataType: EFormContractDataType.LONGTEXT, isRequired: false },
        { name: "logo", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "partners", dataType: EFormContractDataType.UNIQUEIDENTIFIER, isRequired: false, foreignKey: {
          entity: "People",
          connectionAttribute: "_id",
          relationship: "many-to-many"
        } },
        { name: "phoneOne", dataType: EFormContractDataType.NVARCHAR, isRequired: true },
        { name: "emailOne", dataType: EFormContractDataType.NVARCHAR, isRequired: true },
        { name: "addressOneZipCode", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneStreet", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneDistrict", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneNumber", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneComplement", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneCity", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneState", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneLatitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressOneLongitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoZipCode", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoStreet", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoDistrict", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoNumber", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoComplement", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoCity", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoState", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoLatitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "addressTwoLongitude", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "phoneTwo", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "emailTwo", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "siteOne", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "siteTwo", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "linkedin", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "instagram", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
        { name: "facebook", dataType: EFormContractDataType.NVARCHAR, isRequired: false },
      ]
    }
  }],
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
              type: "select",
              name: "country",
              dataType: EDataType.TEXT,
              options: COUNTRIES_FROM_EARTH.map(country => ({ label: country.brazilianPortugueseName, value: country.englishNameAsValue })),
              isRequired: true,
            },
            {
              label: "CNPJ",
              type: "input",
              dataType: EDataType.TEXT,
              name: "cnpj",
              maskRegex: "^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$",
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
                }
              ],
            },
            {
              label: "Razão social",
              type: "input",
              dataType: EDataType.TEXT,
              name: "name",
              isRequired: true,
            },
            {
              label: "Nome fantasia",
              type: "input",
              dataType: EDataType.TEXT,
              name: "businessName",
            },
            {
              type: "input",
              dataType: EDataType.DATE,
              label: "Data de abertura",
              name: "birthday",
            },
            {
              label: "Natureza legal",
              type: "select",
              dataType: EDataType.TEXT,
              name: "legalNature",
              options: [
                { label: "Empresa Pública", value: "201-1" },
                { label: "Sociedade de Economia Mista", value: "203-8" },
                { label: "Sociedade Anônima Aberta", value: "204-6" },
                { label: "Sociedade Anônima Fechada", value: "205-4" },
                { label: "Sociedade Empresária Limitada", value: "206-2" },
                {
                  label: "Sociedade Empresária em Nome Coletivo",
                  value: "207-0",
                },
                {
                  label: "Sociedade Empresária em Comandita Simples",
                  value: "208-9",
                },
                {
                  label: "Sociedade Empresária em Comandita por Ações",
                  value: "209-7",
                },
                { label: "Sociedade em Conta de Participação", value: "212-7" },
                { label: "Empresário(Individual)", value: "213-5" },
                { label: "Cooperativa", value: "214-3" },
                { label: "Consórcio de Sociedades", value: "215-1" },
                { label: "Grupo de Sociedades", value: "216-0" },
                {
                  label: "Estabelecimento, no Brasil, de Sociedade Estrangeira",
                  value: "217-8",
                },
                {
                  label:
                    "Estabelecimento, no Brasil, de Empresa Binacional Argentino - Brasileira",
                  value: "219-4",
                },
                { label: "Empresa Domiciliada no Exterior", value: "221-6" },
                { label: "Clube / Fundo de Investimento", value: "222-4" },
                { label: "Sociedade Simples Pura", value: "223-2" },
                { label: "Sociedade Simples Limitada", value: "224-0" },
                { label: "Sociedade Simples em Nome Coletivo", value: "225-9" },
                {
                  label: "Sociedade Simples em Comandita Simples",
                  value: "226-7",
                },
                { label: "Empresa Binacional", value: "227-5" },
                { label: "Consórcio de Empregadores", value: "228-3" },
                { label: "Consórcio Simples", value: "229-1" },
                {
                  label:
                    "Empresa Individual de Responsabilidade Limitada(de Natureza Empresária)",
                  value: "230-5",
                },
                {
                  label:
                    "Empresa Individual de Responsabilidade Limitada(de Natureza Simples)",
                  value: "231-3",
                },
                { label: "Sociedade Unipessoal de Advogados", value: "232-1" },
                { label: "Cooperativas de Consumo", value: "233-0" },
                {
                  label: "Serviço Notarial e Registral(Cartório)",
                  value: "303-4",
                },
                { label: "Fundação Privada", value: "306-9" },
                { label: "Serviço Social Autônomo", value: "307-7" },
                { label: "Condomínio Edilício", value: "308-5" },
                { label: "Comissão de Conciliação Prévia", value: "310-7" },
                { label: "Entidade de Mediação e Arbitragem", value: "311-5" },
                { label: "Entidade Sindical", value: "313-1" },
                {
                  label:
                    "Estabelecimento, no Brasil, de Fundação ou Associação Estrangeiras",
                  value: "320-4",
                },
                {
                  label: "Fundação ou Associação Domiciliada no Exterior",
                  value: "321-2",
                },
                { label: "Organização Religiosa", value: "322-0" },
                { label: "Comunidade Indígena", value: "323-9" },
                { label: "Fundo Privado", value: "324-7" },
                {
                  label: "Órgão de Direção Nacional de Partido Político",
                  value: "325-5",
                },
                {
                  label: "Órgão de Direção Regional de Partido Político",
                  value: "326-3",
                },
                {
                  label: "Órgão de Direção Local de Partido Político",
                  value: "327-1",
                },
                {
                  label: "Comitê Financeiro de Partido Político",
                  value: "328-0",
                },
                {
                  label: "Frente Plebiscitária ou Referendária",
                  value: "329-8",
                },
                { label: "Organização Social(OS)", value: "330-1" },
                { label: "Demais Condomínios", value: "331-0" },
                { label: "Associação Privada", value: "399-9" },
                { label: "Empresa Individual Imobiliária", value: "401-4" },
                { label: "Segurado Especial", value: "402-2" },
                { label: "Contribuinte individual", value: "408-1" },
                { label: "Candidato a Cargo Político Eletivo", value: "409-0" },
                { label: "Leiloeiro", value: "411-1" },
                { label: "Produtor Rural(Pessoa Física)", value: "412-0" },
                { label: "Organização Internacional", value: "501-0" },
                {
                  label: "Representação Diplomática Estrangeira",
                  value: "502-9",
                },
                {
                  label: "Outras Instituições Extraterritoriais",
                  value: "503-7",
                },
                {
                  label: "Órgão Público do Poder Executivo Federal",
                  value: "101-5",
                },
                {
                  label:
                    "Órgão Público do Poder Executivo Estadual ou do Distrito Federal",
                  value: "102-3",
                },
                {
                  label: "Órgão Público do Poder Executivo Municipal",
                  value: "103-1",
                },
                {
                  label: "Órgão Público do Poder Legislativo Federal",
                  value: "104-0",
                },
                {
                  label:
                    "Órgão Público do Poder Legislativo Estadual ou do Distrito Federal",
                  value: "105-8",
                },
                {
                  label: "Órgão Público do Poder Legislativo Municipal",
                  value: "106-6",
                },
                {
                  label: "Órgão Público do Poder Judiciário Federal",
                  value: "107-4",
                },
                {
                  label: "Órgão Público do Poder Judiciário Estadual",
                  value: "108-2",
                },
                { label: "Autarquia Federal", value: "110-4" },
                {
                  label: "Autarquia Estadual ou do Distrito Federal",
                  value: "111-2",
                },
                { label: "Autarquia Municipal", value: "112-0" },
                {
                  label: "Fundação Pública de Direito Público Federal",
                  value: "113-9",
                },
                {
                  label:
                    "Fundação Pública de Direito Público Estadual ou do Distrito Federal",
                  value: "114-7",
                },
                {
                  label: "Fundação Pública de Direito Público Municipal",
                  value: "115-5",
                },
                { label: "Órgão Público Autônomo Federal", value: "116-3" },
                {
                  label:
                    "Órgão Público Autônomo Estadual ou do Distrito Federal",
                  value: "117-1",
                },
                { label: "Órgão Público Autônomo Municipal", value: "118-0" },
                { label: "Comissão Polinacional", value: "119-8" },
                { label: "Fundo Público", value: "120-1" },
                {
                  label:
                    "Consórcio Público de Direito Público(Associação Pública)",
                  value: "121-0",
                },
                {
                  label: "Consórcio Público de Direito Privado",
                  value: "122-8",
                },
                { label: "Estado ou Distrito Federal", value: "123-6" },
                { label: "Município", value: "124-4" },
                {
                  label: "Fundação Pública de Direito Privado Federal",
                  value: "125-2",
                },
                {
                  label:
                    "Fundação Pública de Direito Privado Estadual ou do Distrito Federal",
                  value: "126-0",
                },
                {
                  label: "Fundação Pública de Direito Privado Municipal",
                  value: "127-9",
                },
              ],
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
                }
              ],
            },
            // input - Inscrição estadual
            {
              label: "Inscrição estadual",
              type: "input",
              dataType: EDataType.TEXT,
              name: "stateRegistration",
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
                }
              ],
              validators: ["onlyNumbers"]
            },
            // input - Inscrição municipal
            {
              type: "input",
              label: "Inscrição municipal",
              dataType: EDataType.TEXT,
              name: "municipalRegistration",
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
                }
              ],
            },
            {
              type: "input",
              dataType: EDataType.WYSIWYG,
              label: "Descrição da empresa",
              name: "description",
            },
            {
              label: "Logo da empresa",
              type: "file",
              dataType: EDataType.TEXT,
              name: "logo",
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "company/logos",
                visibility: "public",
              },
            },
            {
              label: "Sócios",
              type: "autocomplete",
              dataType: EDataType.TEXT,
              tooltip:
                "O(s) sócio(s) deve(m) estar cadastrado(s) no gerenciamento de pessoas.",
              name: "partners",
              optionsApi: {
                endpoint: "/people",
                labelField: ["cpf", "name"],
                valueField: "_id",
                paramsToFilter: ["cpf", "name"],
                paramType: "query",
                relatedEntity: "People",
              },
              isMultiple: true,
            },
            {
              label: "Telefone principal",
              type: "input",
              dataType: EDataType.TEXT,
              name: "phoneOne",
              maskRegex: "^\\(\\d{2}\\) \\d{4,5}-\\d{4}$",
              isRequired: true,
            },
            {
              label: "E-mail principal",
              type: "input",
              dataType: EDataType.EMAIL,
              name: "emailOne",
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
                  type: "input",
                  dataType: EDataType.TEXT,
                  name: "addressOneZipCode",
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
                },
                {
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
                },
              ],
            },
            {
              type: "fieldset",
              id: "addressTwo",
              title: "Endereço 2",
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
                },
                {
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
      ],
    },
  ],
};
