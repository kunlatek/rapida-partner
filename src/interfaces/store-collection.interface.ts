/**
 * Coleção da home da loja (funcionalidade "collections"), como "Lançamentos"
 * ou "Para o fim de semana": um título e os produtos, na ordem escolhida.
 * Cadastrada no Backoffice do vendedor pelo módulo de rapida-projects
 * getStoreCollectionsModule e lida pela loja por IMarketplace.collectionsEndpoint.
 * É um cadastro próprio, e não uma lista na configuração da loja, porque os
 * forms não guardam lista dentro de lista. Os campos são os nomes do form.
 */
export interface IStoreCollection {
  title: string;
  subtitle?: string;
  // Ids dos produtos do vendedor, na ordem em que aparecem.
  productIds: string[];
  // Ordem entre as coleções da home (menor primeiro).
  displayOrder?: number;
  // Desligada, a coleção sai da home.
  isActive: boolean;
}
