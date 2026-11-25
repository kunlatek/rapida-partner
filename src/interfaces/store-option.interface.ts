/**
 * Como a opção muda o preço: "add" soma price em reais ao preço unitário (o
 * padrão; ex.: bacon + R$ 3); "percentOff" desconta price por cento do preço do
 * produto (preço por tipo, Fase 3.2; ex.: meia-entrada 50, criança 30).
 */
export type TStoreOptionPriceType = "add" | "percentOff";

/**
 * Grupo de opções do produto (ex.: "Adicionais", "Ponto da carne"), cadastrado
 * no Backoffice do vendedor pelo módulo de rapida-projects getStoreOptionsModule
 * e lido pela loja por IMarketplace.optionGroupsEndpoint (funcionalidade
 * "productOptions"). Os campos são os nomes do form do módulo.
 */
export interface IStoreOptionGroup {
  name: string;
  // Com isRequired, o cliente precisa escolher pelo menos uma unidade (ou minChoices).
  isRequired?: boolean;
  // Mínimo de unidades escolhidas no grupo; "bacon ×2" conta 2. Vazio: 1 com
  // isRequired, 0 sem.
  minChoices?: number;
  // Máximo de unidades escolhidas no grupo. 1 é escolha única (ex.: ponto da
  // carne); 0 ou vazio, sem limite.
  maxChoices?: number;
  displayOrder?: number;
  isActive?: boolean;
}

/**
 * Opção de um grupo (ex.: "Bacon"), com o preço padrão do acréscimo, lida pela
 * loja por IMarketplace.optionsEndpoint. Cada produto oferece as opções que
 * listar em IProductOptionLink, podendo trocar o preço.
 */
export interface IStoreOption {
  optionGroupId: string;
  name: string;
  // Acréscimo padrão em reais ("add") ou desconto em % ("percentOff", de 0 a 100); 0 quando não muda o preço.
  price: number;
  // Padrão "add". Opção "percentOff" entra uma vez por linha (maxQuantity é ignorado).
  priceType?: TStoreOptionPriceType;
  // Quantas vezes a mesma opção pode ser escolhida numa linha (padrão 1), até
  // STORE_OPTION_MAX_QUANTITY (src/utils/store-order.ts, 10).
  maxQuantity?: number;
  // Desligado, a opção some de todos os produtos (ex.: o bacon acabou).
  isAvailable?: boolean;
  // Insumo baixado do estoque a cada unidade escolhida (um produto do vendedor).
  supplyProductId?: string;
  // Quanto do insumo sai por unidade escolhida (padrão 1, quando vazio).
  supplyQuantity?: number;
  displayOrder?: number;
}

/**
 * Opção oferecida por um produto, no campo productOptions da configuração de
 * venda do produto (form productSellingSettingForm de rapida-projects, que
 * recebe a lista por withProductOptionsInSellingSettings).
 * Sem price, vale o preço padrão da opção; com ele, na mesma unidade do
 * priceType da opção (reais ou %).
 */
export interface IProductOptionLink {
  storeOptionId: string;
  price?: number;
}
