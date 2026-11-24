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
  | "shipping"
  | "coupons"
  | "reviews"
  | "returns"
  | "openingHours";

export type TStoreFeatureToggle = `${TStoreFeature}Enabled`;

/** Fontes oferecidas na configuração da loja (todas do Google Fonts). */
export type TStoreFont = "inter" | "poppins" | "nunito" | "montserrat" | "roboto" | "lato";

/** Arredondamento de cartões, botões e campos: reto, suave ou arredondado. */
export type TStoreRadius = "none" | "soft" | "rounded";

/** Dia da semana de um horário de funcionamento. */
export type TStoreWeekday = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

/**
 * Um período aberto num dia, em "HH:MM" no fuso da loja. Fechar antes de abrir
 * (ex.: 18:00 às 02:00) é atravessar a meia-noite. Um dia pode ter vários
 * períodos (ex.: almoço e jantar).
 */
export interface IStoreOpeningHours {
  weekday: TStoreWeekday;
  opensAt: string;
  closesAt: string;
}

/** Catálogo em grade de cartões ou em lista (foto pequena ao lado do nome). */
export type TStoreCatalogLayout = "grid" | "list";

/**
 * Proporção da foto no cartão do produto: "auto" mostra a foto inteira numa
 * área fixa (o padrão de sempre); as outras recortam a foto na proporção.
 */
export type TStoreImageAspect = "auto" | "square" | "landscape" | "portrait";

/**
 * Configuração da loja: identidade, visual, contato, dados legais, redes,
 * comercial e liga e desliga. É o registro único editado no Backoffice do
 * vendedor pelo módulo de rapida-projects `getStoreSettingsModule` (os nomes dos campos do
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
  catalogLayout?: TStoreCatalogLayout;
  // Colunas da grade no computador; só vale com catalogLayout "grid".
  catalogColumns?: 2 | 3 | 4;
  productImageAspect?: TStoreImageAspect;

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

  // Só tem efeito com a funcionalidade "returns": dias, a partir da entrega,
  // em que o cliente pode pedir devolução ou troca (o CDC exige ao menos 7
  // para compra fora da loja física).
  returnWindowDays?: number;

  // Só têm efeito com a funcionalidade "openingHours": fora dos períodos, ou
  // com ordersPaused, a loja não aceita pedidos (a API recusa e a vitrine
  // avisa). Sem períodos, a loja fica sempre aberta. timeZone é um fuso IANA
  // (padrão "America/Sao_Paulo"). weekdayHours e saturdayHours continuam como
  // texto de contato.
  openingHours?: IStoreOpeningHours[];
  timeZone?: string;
  ordersPaused?: boolean;

  // Páginas institucionais e legais, em HTML (editor de texto rico). Cada
  // página só é publicada, com link no rodapé, quando tem texto. O contato usa
  // os campos de contato acima.
  aboutText?: string;
  privacyPolicyText?: string;
  termsText?: string;
  returnsPolicyText?: string;
  // Texto do aviso de cookies; sem ele, o aviso não aparece.
  cookieNoticeText?: string;

  // Home: banners do carrossel (na ordem), benefícios e produtos em destaque
  // (ids dos produtos do vendedor). Sem banners nem benefícios, a vitrine usa
  // os textos padrão.
  banners?: IStoreBanner[];
  benefits?: IStoreBenefit[];
  featuredProductIds?: string[];
}

/** Banner do carrossel da home. */
export interface IStoreBanner {
  // URL da imagem (upload no Backoffice).
  image?: string;
  title: string;
  subtitle?: string;
  // Destino do botão: caminho da loja (ex.: "/busca?categoria=blu-ray") ou URL.
  linkUrl?: string;
  linkLabel?: string;
}

/** Benefício mostrado na home (ex.: "Frete grátis acima de R$ 300"). */
export interface IStoreBenefit {
  // Nome de um ícone Lucide (ex.: "truck", "shield-check").
  icon?: string;
  title: string;
  text?: string;
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
 * Segmento da loja. Escolhe os padrões do segmento: textos, funcionalidades
 * ligadas, rótulos do andamento do pedido e etapas do checkout. Cada
 * funcionalidade continua podendo ser ligada ou desligada em `features`.
 * - "retail": produtos com envio (o comportamento de sempre).
 * - "food": cardápio, com entrega local ou retirada.
 * - "services": serviços e passeios com data.
 * - "events": shows e teatro, com sessões e ingressos.
 */
export type TStoreSegment = "retail" | "food" | "services" | "events";

/**
 * Configuração da loja no projeto da própria loja (`IProject.store`).
 *
 * A loja lê a configuração salva no Backoffice do vendedor em
 * `IMarketplace.storeSettingsEndpoint`; `defaults` vale até a primeira
 * gravação e como reserva se a leitura falhar.
 */
export interface IProjectStore {
  // Um segmento por loja; só vale para skeleton "ecommerce"/"marketplace".
  // Sem ele, a loja se comporta como "retail".
  segment?: TStoreSegment;
  // Funcionalidades opcionais geradas. Sem a lista, vale o padrão do segmento
  // (STORE_SEGMENT_DEFAULT_FEATURES); sem segmento, nenhuma é gerada. Passe a
  // mesma lista (storeFeaturesOf) para getStoreSettingsModule no Backoffice do
  // vendedor, para o form só mostrar o liga e desliga do que a loja tem.
  features?: TStoreFeature[];
  defaults?: IStoreSettings;
}
