import type { IProject } from "../../interfaces/project.interface";
import { characterModule } from "../modules/character";
import { companyModule } from "../modules/company";
import { movieModule } from "../modules/movie";
import { personModule } from "../modules/person";

export const movieBackoffice: IProject = {
  id: "movieBackoffice",
  title: "Movie Backoffice",
  description: "Sistema de gerenciamento para filmes e personagens.",
  flow: "permeson",
  businessPlan: {
    businessValue: "Gerenciar e otimizar as operações do Movie.",
    targetMarket: "Empresas que utilizam o Movie para gerenciar sugestões e feedbacks.",
    benchmarkings: "Análise de sistemas de gerenciamento de feedbacks.",
    legalIssues: "Conformidade com leis de proteção de dados.",
    ethicalIssues: "Garantir a privacidade dos usuários.",
    afterSales: "Suporte contínuo e atualizações regulares.",
    monetization: "Assinaturas mensais para acesso ao sistema.",
  },
  frontend: {
    framework: "svelte",
    uiKit: "flowbite",
  },
  backend: {
    framework: "nest",
    jwtSecret: "50m3JwtS3cr3tK3y!", // Change to a strong secret key
    database: {
      provider: "mongodb",
      connectionString:
        "mongodb+srv://user:P455w0rd@2025@host.mongodb.net/movie-v1", // Complete with actual connection string
      credentials: {
        databaseName: "movie-v1", // Complete with actual database name
        username: "user", // Complete with actual username
        password: "P455w0rd@2025", // Complete with actual password
        host: "host.mongodb.net", // Complete with actual host
      },
    },
    storage: {
      provider: "gcs",
      credentials: {
        clientEmail:
          "rapida-personal@rapida-personal-projects.iam.gserviceaccount.com", // Complete with actual client email
        privateKey:
          "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n", // Complete with actual key
        projectId: "rapida-personal-projects", // Complete with actual project ID
      },
      publicBucketName: "rapida-public-files",
      privateBucketName: "rapida-private-files",
    },
    logging: {
      discordWebhookUrl:
        "https://discord.com/api/webhooks/1370095507959054429/Ay8pIM-sinbjsLMAAWGrRDFT-oyBD3xu7yB2Ke0Bx6RxpKN882taB4_tkD2xsdk8MirZ",
    },
    email: { // Configure with actual gmail service credentials
      smtpUser: "noreply.rapida@gmail.com", // Change to a valid email address
      smtpPass: "50m3S3cur3P4ssw0rd!", // Change to a strong password
      smtpFrom: "noreply@kunlatek.com", // Change to a valid email address
    },
    baseUrl: "http://localhost:5173",
  },
  modules: [
    personModule,
    companyModule,
    movieModule,
    characterModule,
  ],
};
