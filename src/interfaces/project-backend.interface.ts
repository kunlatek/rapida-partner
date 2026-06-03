import type { IFormAutocomplete } from "./form-autocomplete.interface";

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
}

interface IEmail {
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
}

interface IMarketplace {
  paymentGateways?: IPaymentGateway[];
   productsAutocomplete?: IFormAutocomplete;
}

interface IPaymentGateway {
  provider: "mercadoPago" | "pagSeguro" | "unionPay";
  apiKey: string;
}

export interface IBackend {
  framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
  database: IDatabase;
  jwtSecret: string;
  baseUrl?: string;
  storage?: IStorage;
  logging?: ILogging;
  whatsapp?: IWhatsapp;
  email?: IEmail;
  marketplace?: IMarketplace;
}