import { EDataType } from "../../enums/form.enum";
import type { IFormElement } from "../../interfaces/form.interface";
import type { IStorageConfig } from "../../interfaces/form-file.interface";
import { tr } from "./translations";

const storageConfig: IStorageConfig = {
  path: "store-settings",
  fileNameStrategy: "uuid",
  visibility: "public",
};

const richText = (name: string, label: ReturnType<typeof tr>): IFormElement => ({
  type: "input",
  name,
  dataType: EDataType.WYSIWYG,
  label,
  storageConfig,
});

/** Páginas institucionais e legais (L20): cada uma só é publicada quando tem texto. */
export const pagesElements: IFormElement[] = [
  richText("aboutText", tr("Sobre a loja", "About the store", "Sobre la tienda")),
  richText("privacyPolicyText", tr("Política de privacidade", "Privacy policy", "Política de privacidad")),
  richText("termsText", tr("Termos de uso", "Terms of use", "Términos de uso")),
  richText("returnsPolicyText", tr("Trocas e devoluções", "Returns and exchanges", "Cambios y devoluciones")),
  {
    type: "input",
    name: "cookieNoticeText",
    dataType: EDataType.TEXT,
    label: tr("Aviso de cookies", "Cookie notice", "Aviso de cookies"),
    tooltip: tr("Sem texto, o aviso não aparece.", "Without text, the notice is not shown.", "Sin texto, el aviso no aparece."),
  },
];

export interface IFeaturedProductsApi {
  // Endpoint dos produtos do vendedor (padrão "/products").
  endpoint?: string;
  // Campos mostrados na escolha (padrão ["name"]).
  labelField?: string[];
}

/** Home da vitrine (L25): banners, benefícios e produtos em destaque. */
export const getShowcaseElements = (productsApi: IFeaturedProductsApi = {}): IFormElement[] => [
  {
    type: "array",
    name: "banners",
    label: tr("Banners", "Banners", "Banners"),
    elements: [
      {
        type: "file",
        name: "image",
        dataType: EDataType.TEXT,
        label: tr("Imagem", "Image", "Imagen"),
        validators: ["onlyImages"],
        storageConfig,
      },
      { type: "input", name: "title", dataType: EDataType.TEXT, label: tr("Título", "Title", "Título"), isRequired: true },
      { type: "input", name: "subtitle", dataType: EDataType.TEXT, label: tr("Subtítulo", "Subtitle", "Subtítulo") },
      {
        type: "input",
        name: "linkUrl",
        dataType: EDataType.TEXT,
        label: tr("Link do botão", "Button link", "Enlace del botón"),
        tooltip: tr("Caminho da loja (ex.: /busca?categoria=blu-ray) ou URL", "Store path (e.g. /busca?categoria=blu-ray) or URL", "Ruta de la tienda (ej.: /busca?categoria=blu-ray) o URL"),
      },
      { type: "input", name: "linkLabel", dataType: EDataType.TEXT, label: tr("Texto do botão", "Button text", "Texto del botón") },
    ],
  },
  {
    type: "array",
    name: "benefits",
    label: tr("Benefícios", "Benefits", "Beneficios"),
    elements: [
      {
        type: "input",
        name: "icon",
        dataType: EDataType.TEXT,
        label: tr("Ícone", "Icon", "Ícono"),
        tooltip: tr("Nome de um ícone Lucide (ex.: truck, shield-check)", "Lucide icon name (e.g. truck, shield-check)", "Nombre de un ícono Lucide (ej.: truck, shield-check)"),
      },
      { type: "input", name: "title", dataType: EDataType.TEXT, label: tr("Título", "Title", "Título"), isRequired: true },
      { type: "input", name: "text", dataType: EDataType.TEXT, label: tr("Texto", "Text", "Texto") },
    ],
  },
  {
    type: "autocomplete",
    name: "featuredProductIds",
    dataType: EDataType.UNIQUEIDENTIFIER,
    label: tr("Produtos em destaque", "Featured products", "Productos destacados"),
    isMultiple: true,
    optionsApi: {
      endpoint: productsApi.endpoint ?? "/products",
      relatedEntity: "products",
      labelField: productsApi.labelField ?? ["name"],
      valueField: "_id",
      paramsToFilter: productsApi.labelField ?? ["name"],
      paramType: "query",
    },
  },
];
