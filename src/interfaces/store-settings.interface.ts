/**
 * Funcionalidades opcionais da loja (`skeleton` "ecommerce" ou "marketplace").
 * Cada uma tem duas camadas: `IProjectStore.features` decide se o código dela é
 * gerado, e o liga e desliga `<feature>Enabled` de `IStoreSettings` decide, com
 * a loja no ar, se ela aparece.
 */
export type TStoreFeature =
  | "whatsappButton"
  | "stockAvailability"
  | "cashDiscount"
  | "installments"
  | "favorites"
  | "blog"
  | "shipping";

export type TStoreFeatureToggle = `${TStoreFeature}Enabled`;

/** Fontes oferecidas na configuração da loja (todas do Google Fonts). */
export type TStoreFont = "inter" | "poppins" | "nunito" | "montserrat" | "roboto" | "lato";

/** Arredondamento de cartões, botões e campos: reto, suave ou arredondado. */
export type TStoreRadius = "none" | "soft" | "rounded";

/**
 * Configuração da loja: identidade, visual, contato, dados legais, redes,
 * comercial e liga e desliga. É o registro único editado no Backoffice do
 * vendedor pelo módulo pronto `getStoreSettingsModule` (os nomes dos campos do
 * form são estas mesmas chaves) e também o formato dos valores iniciais em
 * `IProjectStore.defaults`.
 *
 * Logo e favicon não entram aqui: no Backoffice são uploads (`logo` e
 * `favicon` no form) e os valores iniciais continuam vindo de
 * `IFrontend.logoPath`/`IFrontend.faviconPath`.
 *
 * Cores sempre em hexadecimal de 6 dígitos ("#RRGGBB"); o gerador deriva as
 * tonalidades e as cores de contraste a partir delas.
 */
export interface IStoreSettings extends Partial<Record<TStoreFeatureToggle, boolean>> {
  name?: string;
  tagline?: string;

  primaryColor?: string;
  secondaryColor?: string;
  // Cor escura de cabeçalho, rodapé e botões principais.
  inkColor?: string;
  font?: TStoreFont;
  radius?: TStoreRadius;
  pageSize?: number;

  // Somente dígitos, com DDI (ex.: "5582999999999").
  whatsappNumber?: string;
  phone?: string;
  email?: string;
  weekdayHours?: string;
  saturdayHours?: string;

  companyName?: string;
  cnpj?: string;
  address?: string;

  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;

  // Só têm efeito com as funcionalidades "cashDiscount" e "installments".
  cashDiscountPercent?: number;
  maxInstallments?: number;

  // Só têm efeito com a funcionalidade "shipping". CEP de onde os pedidos
  // saem (somente dígitos), frete grátis a partir de um valor e a tabela de
  // faixas de CEP com valor e prazo. CEP fora de toda faixa não é atendido.
  originZipCode?: string;
  freeShippingAbove?: number;
  shippingRanges?: IStoreShippingRange[];
}

/** Faixa de CEP (inclusiva, somente dígitos) com valor e prazo do frete. */
export interface IStoreShippingRange {
  // Nome da faixa mostrado ao cliente (ex.: "Capital", "Nordeste").
  label?: string;
  zipCodeStart: string;
  zipCodeEnd: string;
  price: number;
  // Prazo de entrega em dias úteis.
  deliveryDays: number;
}

/**
 * Configuração da loja no projeto da própria loja (`IProject.store`).
 *
 * A loja lê a configuração salva no Backoffice do vendedor em
 * `IMarketplace.storeSettingsEndpoint`; `defaults` vale até a primeira
 * gravação e como reserva se a leitura falhar.
 */
export interface IProjectStore {
  // Funcionalidades opcionais geradas. Sem a lista, nenhuma é gerada. Passe a
  // mesma lista para getStoreSettingsModule no Backoffice do vendedor, para o
  // form só mostrar o liga e desliga do que a loja tem.
  features?: TStoreFeature[];
  defaults?: IStoreSettings;
}
