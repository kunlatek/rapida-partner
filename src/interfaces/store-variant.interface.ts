/**
 * Variação como produto filho (funcionalidade "productVariants", Fase 3.3).
 * O produto pai lista os atributos (variantOptions); o Backoffice do vendedor
 * gera um produto filho por combinação, com parentProductId e
 * variantAttributes. Cada filho é um produto com estoque próprio. Os nomes são
 * os padrões de IMarketplaceProductFieldMap (parent, variantAttributes, variantActive).
 */

/** Atributo do pai e os valores separados por vírgula (ex.: "Tamanho", "P, M, G"). */
export interface IProductVariantOption {
  attributeName: string;
  attributeValues: string;
}

/** Valor do atributo num filho (ex.: "Tamanho", "M"). */
export interface IProductVariantAttribute {
  attributeName: string;
  attributeValue: string;
}

export interface IProductVariantFields {
  variantOptions?: IProductVariantOption[];
  parentProductId?: string;
  variantAttributes?: IProductVariantAttribute[];
  // Falso quando a combinação saiu da lista do pai: o filho não é apagado, só some da loja.
  isVariantActive?: boolean;
}
