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

/**
 * Sessão de um evento ou passeio (Fase 5.1): data, hora e local. Com os
 * setores, o Backoffice gera um produto filho por sessão × setor, com estoque
 * igual à capacidade do setor.
 */
export interface IProductSession {
  sessionDate: string;
  // "HH:MM" (campo de hora).
  sessionTime: string;
  venue?: string;
}

/** Setor de uma sessão (ex.: Pista, Camarote), com a capacidade e, se diferente do evento, o preço. */
export interface IProductSector {
  sectorName: string;
  capacity: number;
  price?: number;
}

export interface IProductSessionFields {
  sessions?: IProductSession[];
  sectors?: IProductSector[];
  // No filho: quando a sessão começa (a loja esconde sessões que já começaram) e a capacidade lançada no estoque.
  sessionStartsAt?: string;
  sessionCapacity?: number;
}
