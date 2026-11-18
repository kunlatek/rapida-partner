import { EDataType } from "../../enums/form.enum";
import type { IPublicContract } from "../../interfaces/form-contract.interface";
import type { IForm, IFormElement } from "../../interfaces/form.interface";
import type { IList } from "../../interfaces/list.interface";
import type { IModule } from "../../interfaces/project.interface";
import { tr } from "../store-settings/translations";

export const STORE_BLOG_POSTS_ENDPOINT = "/store-blog-posts";

export interface IStoreBlogModuleOptions {
  publicAccess?: IPublicContract["access"];
  allowedOrigins?: string[];
}

const ENTITY = "storeBlogPosts";

const postElements: IFormElement[] = [
  { type: "input", name: "title", dataType: EDataType.TEXT, label: tr("Título", "Title", "Título"), isRequired: true, space: 2 },
  {
    type: "input",
    name: "slug",
    dataType: EDataType.TEXT,
    label: tr("Nome na URL", "URL name", "Nombre en la URL"),
    tooltip: tr("Letras minúsculas, números e hífen (ex.: como-guardar-blu-ray)", "Lowercase letters, numbers and hyphens (e.g. how-to-store-blu-ray)", "Letras minúsculas, números y guion (ej.: como-guardar-blu-ray)"),
    isRequired: true,
    isUnique: true,
    space: 2,
  },
  { type: "input", name: "excerpt", dataType: EDataType.TEXT, label: tr("Resumo", "Excerpt", "Resumen") },
  {
    type: "file",
    name: "coverImage",
    dataType: EDataType.TEXT,
    label: tr("Imagem de capa", "Cover image", "Imagen de portada"),
    validators: ["onlyImages"],
    storageConfig: { path: "store-blog-posts", fileNameStrategy: "uuid", visibility: "public" },
  },
  {
    type: "input",
    name: "content",
    dataType: EDataType.WYSIWYG,
    label: tr("Conteúdo", "Content", "Contenido"),
    isRequired: true,
    storageConfig: { path: "store-blog-posts", fileNameStrategy: "uuid", visibility: "public" },
  },
  { type: "datepicker", name: "publishedAt", label: tr("Publicar em", "Publish on", "Publicar el") },
  { type: "switch", name: "isPublished", label: tr("Publicado", "Published", "Publicado") },
];

export const getStoreBlogPostForm = (options: IStoreBlogModuleOptions = {}): IForm => ({
  componentType: "form",
  id: "storeBlogPostForm",
  title: tr("Artigo do blog", "Blog post", "Artículo del blog"),
  icon: "newspaper",
  guards: "isAuthorized",
  elements: postElements,
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_BLOG_POSTS_ENDPOINT,
      actions: ["create", "get", "getById", "update", "softDelete"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
  publicContracts: [
    {
      id: "storeBlogPostsFromStore",
      endpoint: STORE_BLOG_POSTS_ENDPOINT,
      actions: ["get", "getById"],
      access: options.publicAccess ?? "trustedCallers",
      ...(options.allowedOrigins ? { allowedOrigins: options.allowedOrigins } : {}),
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

export const getStoreBlogPostList = (): IList => ({
  componentType: "list",
  id: "storeBlogPostList",
  title: tr("Blog", "Blog", "Blog"),
  guards: ["isAuthorized"],
  dataSource: { endpoint: STORE_BLOG_POSTS_ENDPOINT, paramType: "query", hasAuthentication: true },
  listItems: [
    { property: "title", type: "title", label: tr("Título", "Title", "Título"), dataType: EDataType.TEXT },
    { property: "excerpt", type: "subtitle", label: tr("Resumo", "Excerpt", "Resumen"), dataType: EDataType.TEXT },
    { property: "publishedAt", label: tr("Publicar em", "Publish on", "Publicar el"), dataType: EDataType.DATE },
  ],
  contracts: [
    {
      id: ENTITY,
      endpoint: STORE_BLOG_POSTS_ENDPOINT,
      actions: ["get", "getById", "update", "softDelete"],
      request: { entity: ENTITY, fields: [] },
    },
  ],
});

/**
 * Módulo pronto "Blog", para o Backoffice do vendedor (funcionalidade
 * "blog"). A loja lista os artigos publicados por IMarketplace.blogPostsEndpoint
 * (STORE_BLOG_POSTS_ENDPOINT).
 */
export const getStoreBlogModule = (options: IStoreBlogModuleOptions = {}): IModule => ({
  id: "storeBlogModule",
  title: tr("Blog", "Blog", "Blog"),
  icon: "newspaper",
  components: [getStoreBlogPostList(), getStoreBlogPostForm(options)],
});
