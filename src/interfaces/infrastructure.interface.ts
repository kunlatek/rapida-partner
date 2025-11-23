export interface IInfrastructure {
  provider: "aws" | "gcp" | "azure" | "hostinger" | "custom";
  region: string;
  resourcePrefix: string;
  stateManagement: {
    strategy: "local" | "remote";
    bucketName?: string;
  };
  dns?: {
    rootDomain: string;
    subdomain?: string;
    manageZone?: boolean;
  };
  compute: {
    strategy: "serverless" | "container" | "vm";
    size: "nano" | "micro" | "small" | "medium" | "large" | "xlarge";
    scaling?: {
      minInstances?: number;
      maxInstances?: number;
    };
  };
  storage?: {
    frontendStrategy?: "bucket_static" | "container";
    assetStorage?: boolean;
  };
  database?: {
    provision: boolean;
    tier?: "development" | "production";
  };
  credentials: {
    aws?: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    gcp?: {
      projectId: string;
      clientEmail: string;
      privateKey: string;
    };
    azure?: {
      subscriptionId: string;
      tenantId: string;
      clientId: string;
      clientSecret: string;
    };
    hostinger?: {
      apiToken: string;
    };
  };
}