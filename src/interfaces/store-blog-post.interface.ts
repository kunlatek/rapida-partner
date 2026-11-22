/**
 * Artigo do blog da loja (funcionalidade "blog"), escrito no Backoffice do
 * vendedor pelo módulo de rapida-projects getStoreBlogModule e lido pela loja por
 * IMarketplace.blogPostsEndpoint. Os campos são os nomes do form.
 */
export interface IStoreBlogPost {
  title: string;
  // Nome amigável na URL; um por workspace.
  slug: string;
  excerpt?: string;
  // Conteúdo em HTML (editor de texto rico).
  content: string;
  // URL da imagem de capa (upload no form).
  coverImage?: string;
  // Data de publicação (ISO 8601); a loja só lista os publicados até agora.
  publishedAt?: string;
  isPublished: boolean;
}
