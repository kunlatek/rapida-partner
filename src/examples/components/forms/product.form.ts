import { EDataType } from "../../../enums/form.enum";
import type { IComponent } from "../../../interfaces/project.interface";

export const productForm: IComponent = {
  title: "Gerenciamento de produtos",
  componentType: "form",
  id: "productForm",
  guards: "isAuthorized",
  elements: [
    {
      type: "tab",
      id: "productTab",
      tabs: [
        {
          id: "mainTab",
          title: "Dados principais",
          elements: [
            {
              type: "input",
              dataType: EDataType.NVARCHAR,
              label: "Nome do produto",
              name: "name",
              isRequired: true,
            },
            {
              type: "select",
              name: "saleMeasure",
              label: "Medida para venda",
              dataType: EDataType.NVARCHAR,
              options: [
                { label: "Unidade", value: "unit" },
                { label: "Quilo", value: "kg" },
                { label: "Grama", value: "g" },
                { label: "Miligrama", value: "mg" },
                { label: "Metro", value: "m" },
                { label: "Centímetro", value: "cm" },
                { label: "Milímetro", value: "mm" },
                { label: "Litro", value: "l" },
                { label: "Mililitro", value: "ml" },
                { label: "Metro quadrado", value: "m2" },
                { label: "Metro cúbico", value: "m3" },
              ],
              isRequired: true,
            },
            {
              label: "Imagens do produto",
              type: "file",
              dataType: EDataType.NVARCHAR,
              name: "productImages",
              validators: ["jpg", "png"],
              isMultiple: true,
              storageConfig: {
                fileNameStrategy: "uuid",
                path: "products",
                visibility: "public",
              },
            },
            {
              type: "input",
              name: "description",
              label: "Descrição do produto",
              dataType: EDataType.LONGTEXT,
            },
            {
              type: "input",
              name: "price",
              label: "Preço para venda",
              dataType: EDataType.FLOAT,
            },
            {
              type: "autocomplete",
              dataType: EDataType.UNIQUEIDENTIFIER,
              label: "Marca do produto",
              name: "brandId",
              optionsApi: {
                relatedEntity: "brands",
                labelField: ["name"],
                valueField: "_id",
                paramsToFilter: ["name"],
                paramType: "query",
                endpoint: "/brands",
              },
            },
            {
              type: "input",
              label: "Modelo do produto",
              name: "productModel",
              dataType: EDataType.NVARCHAR,
            },
          ],
        },
        {
          id: "measuresTab",
          title: "Medidas do produto",
          elements: [
            {
              type: "input",
              name: "centimeterWidth",
              label: "Largura em centímetros",
              dataType: EDataType.FLOAT,
            },
            {
              type: "input",
              name: "centimeterHeight",
              label: "Altura em centímetros",
              dataType: EDataType.FLOAT,
            },
            {
              type: "input",
              name: "centimeterLength",
              label: "Comprimento em centímetros",
              dataType: EDataType.FLOAT,
            },
            {
              type: "input",
              name: "gramWeight",
              label: "Peso em gramas",
              dataType: EDataType.FLOAT,
            },
          ],
        },
        {
          id: "identifiersTab",
          title: "Identificadores",          
          elements: [
            {
              type: "autocomplete",
              dataType: EDataType.UNIQUEIDENTIFIER,
              label: "Seção do NCM",
              name: "ncmSectionId",
              optionsApi: {
                relatedEntity: "ncmSections",
                labelField: ["code", "description"],
                valueField: "_id",
                paramsToFilter: ["description", "code"],
                paramType: "query",
                isExternal: true,
                endpoint:
                  "https://rapidax-fundamento-api.y8dalo.easypanel.host/ncm-sections",
              },
            },
            {
              type: "autocomplete",
              dataType: EDataType.UNIQUEIDENTIFIER,
              label: "Posição do NCM",
              name: "ncmPositionId",
              optionsApi: {
                relatedEntity: "ncmPositions",
                labelField: ["code", "description"],
                valueField: "_id",
                paramsToFilter: ["description", "code"],
                paramType: "query",
                isExternal: true,
                endpoint:
                  "https://rapidax-fundamento-api.y8dalo.easypanel.host/ncm-positions",
                filtersFromOtherFormFields: [
                  {
                    formFieldName: "ncmSectionId",
                    filterPropertyName: "ncmSectionId",
                  },
                ],
              },
            },
            {
              type: "autocomplete",
              dataType: EDataType.UNIQUEIDENTIFIER,
              label: "Subposição do NCM",
              name: "ncmSubPositionId",
              optionsApi: {
                relatedEntity: "ncmSubpositions",
                labelField: ["code", "description"],
                valueField: "_id",
                paramsToFilter: ["description", "code"],
                paramType: "query",
                isExternal: true,
                endpoint:
                  "https://rapidax-fundamento-api.y8dalo.easypanel.host/ncm-subpositions",
                filtersFromOtherFormFields: [
                  {
                    formFieldName: "ncmPositionId",
                    filterPropertyName: "ncmPositionId",
                  },
                ],
              },
            },
            {
              type: "autocomplete",
              dataType: EDataType.UNIQUEIDENTIFIER,
              label: "Item do NCM",
              name: "ncmItemId",
              optionsApi: {
                relatedEntity: "ncmItems",
                labelField: ["code", "description"],
                valueField: "_id",
                paramsToFilter: ["description", "code"],
                paramType: "query",
                isExternal: true,
                endpoint:
                  "https://rapidax-fundamento-api.y8dalo.easypanel.host/ncm-items",
                filtersFromOtherFormFields: [
                  {
                    formFieldName: "ncmSubPositionId",
                    filterPropertyName: "ncmSubPositionId",
                  },
                ],
              },
            },
            {
              type: "autocomplete",
              dataType: EDataType.UNIQUEIDENTIFIER,
              label: "Subitem do NCM",
              name: "ncmSubItemId",
              optionsApi: {
                relatedEntity: "ncmSubitems",
                labelField: ["code", "description"],
                valueField: "_id",
                paramsToFilter: ["description", "code"],
                paramType: "query",
                isExternal: true,
                endpoint:
                  "https://rapidax-fundamento-api.y8dalo.easypanel.host/ncm-subitems",
                filtersFromOtherFormFields: [
                  {
                    formFieldName: "ncmItemId",
                    filterPropertyName: "ncmItemId",
                  },
                ],
              },
            },
            {
              type: "input",
              name: "ean13",
              label: "Código de barras EAN13",
              dataType: EDataType.NVARCHAR,
            },
            {
              type: "input",
              name: "ean14",
              label: "Código de barras EAN14",
              dataType: EDataType.NVARCHAR,
            },
            // {
            //   type: "autocomplete",
            //   name: "productsTags",
            //   label: "Tag",
            //   dataType: EDataType.UNIQUEIDENTIFIER,
            //   optionsApi: {
            //     relatedEntity: "tags",
            //     endpoint: "/tags",
            //     labelField: ["tagName"],
            //     valueField: "_id",
            //     paramsToFilter: ["tagName"],
            //     paramType: "query",
            //   },
            //   isMultiple: true,
            // },
          ]
        },
        {
          id: "inputsTab",
          title: "Insumos",
          elements: [
            {
              label: "Insumo",
              name: "productsInputs",
              type: "array",
              elements: [
                {
                  type: "autocomplete",
                  name: "productInputId",
                  label: "Produto",
                  dataType: EDataType.UNIQUEIDENTIFIER,
                  optionsApi: {
                    relatedEntity: "products",
                    endpoint: "/products",
                    labelField: ["name", "saleMeasure", "ean13", "ean14"],
                    valueField: "_id",
                    paramsToFilter: ["name", "productModel", "ean13", "ean14"],
                    paramType: "query",
                  },
                  isRequired: true,
                },
                {
                  type: "input",
                  name: "inputQuantity",
                  label: "Quantidade",
                  dataType: EDataType.INTEGER,
                },
                {
                  type: "input",
                  name: "inputComment",
                  label: "Comentário",
                  dataType: EDataType.LONGTEXT,
                },
              ],
            },
          ],
        },
        {
          id: "othersTab",
          title: "Informações adicionais",
          elements: [
            {
              label: "Atributo",
              name: "othersProperties",
              type: "array",
              elements: [
                {
                  type: "input",
                  name: "otherProperty",
                  label: "Atributo",
                  dataType: EDataType.NVARCHAR,
                  isRequired: true,
                },
                {
                  type: "input",
                  name: "otherValue",
                  label: "Valor",
                  dataType: EDataType.FLOAT,
                  isRequired: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  contracts: [
    {
      id: "products",
      endpoint: "/products",
      actions: ["create", "update", "get", "getById", "softDelete"],
      request: {
        entity: "products",
        fields: [],
      },
    },
  ],
};
