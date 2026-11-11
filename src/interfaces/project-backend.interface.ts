import type { IFormAutocomplete } from "./form-autocomplete.interface";
import type { IList } from "./list.interface";
import type { ITrustedCaller } from "./trusted-caller.interface";

interface IDatabase {
  provider:
    | "mariadb"
    | "mongodb"
    | "oracle"
    | "postgresql"
    | "mysql"
    | "sqlite"
    | "sqlserver";
  connectionString: string;
  credentials: {
    username: string;
    password: string;
    host: string;
    databaseName: string;
    port?: number;
  };
}

interface IStorage {
  provider: "gcs" | "s3" | "azure";
  publicBucketName: string;
  privateBucketName: string;
  credentials: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
}

interface ILogging {
  discordWebhookUrl?: string;
}

interface IWhatsapp {
  whatsappToken: string;
  whatsappPhoneNumberId: string;
  whatsappVerifyToken: string;
  whatsappBusinessAccountId: string;
  whatsappAppSecret?: string;
}

interface IEmail {
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
}

interface IMarketplace {
  paymentGateways: IPaymentGateway[];
  productsAutocomplete: IFormAutocomplete;
  stockInEndpoint: string;
  stockOutEndpoint: string;
  productBaseUrl: string;
  // Endpoint, na mesma base de productBaseUrl, das configurações de venda dos
  // produtos (productId, price, isActive). Quando presente, o preço de venda
  // vem daqui e o backend calcula o valor do pedido; sem ele, usa product.price.
  productSellingSettingsEndpoint?: string;
  // Workspace do vendedor (dono dos dados). A loja só lê produtos, preços e
  // estoque desse workspace e grava nele as movimentações de estoque.
  sellerWorkspaceId?: string;
  // Identidade da loja como chamador confiável do vendedor (RFC 7523). O
  // vendedor declara a mesma loja em IBackend.trustedCallers.
  sellerServiceAuth?: ISellerServiceAuth;
  // Campos fixos da saída de estoque gravada no vendedor a cada venda aprovada
  // (ex.: stockOutType, hasSerialNumber, responsibleId da pessoa padrão).
  stockOutDefaults?: Record<string, string | number | boolean>;
}

export interface ISellerServiceAuth {
  // Valor da claim "iss"; deve bater com ITrustedCaller.issuer no vendedor.
  issuer: string;
  // Valor da claim "aud"; deve bater com ITrustedCaller.audience no vendedor.
  audience: string;
  // Chave privada RSA (PEM) com que a loja assina o token de serviço.
  privateKey: string;
  // "kid" publicado no JWKS da loja; padrão "store-key".
  keyId?: string;
}

interface IService {
  paymentGateways: IPaymentGateway[];
  appointmentList: IList;
  availabilityScheduleList: IList;
  appointmentByAiList?: IList;
}

export interface IPaymentGateway {
  provider: "mercadoPago" | "pagSeguro" | "unionPay";
}

export interface IBackend {
  environment: string;
  baseUrl: string;
  isActiveEnvironment: boolean;
  framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
  database: IDatabase;
  jwtSecret: string;
  trustedCallers?: ITrustedCaller[];
  storage?: IStorage;
  logging?: ILogging;
  whatsapp?: IWhatsapp;
  email?: IEmail;
  marketplace?: IMarketplace;
  service?: IService;
  mercadoPagoIntegration?: {
    publicKey?: string;
    accessToken?: string;
    appId?: string;
    userId?: string;
    testUserId?: string;
    password?: string;
    verificationCode?: string;
    testSellerSettings?: {
      userId: string;
      user: string;
      password: string;
      verificationCode: string;
    };
    testBuyerSettings?: {
      userId: string;
      user: string;
      password: string;
      verificationCode: string;
    };
  };
}
