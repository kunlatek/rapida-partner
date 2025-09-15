interface IDatabase {
  provider:
    | "mariadb"
    | "mongodb"
    | "oracle"
    | "postgresql"
    | "mysql"
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

interface IEmail {
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
}

export interface IBackend {
  framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
  database: IDatabase;
  jwtSecret: string;
  baseUrl?: string;
  storage?: IStorage;
  logging?: ILogging;
  email?: IEmail;
}