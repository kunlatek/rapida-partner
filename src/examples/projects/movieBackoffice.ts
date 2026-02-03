import { DATABASE_PASSWORD } from "../../constants/secrets/database";
import { DISCORD_WEBHOOK_URL, JWT_SECRET, SMTP_PASSWORD } from "../../constants/secrets/others";
import { STORAGE_PRIVATE_KEY } from "../../constants/secrets/storage";
import type { IProject } from "../../interfaces/project.interface";
import { movieGenreChart } from "../components/charts/movieGenre.chart";
import { actorModule } from "../modules/actor";
import { characterModule } from "../modules/character";
import { movieModule } from "../modules/movie";

export const movieBackoffice: IProject = {
  id: "movieBackoffice",
  title: "Movie Backoffice",
  description: "Sistema de gerenciamento para filmes e personagens.",
  flow: "backofficeOpenedAndPermissionsByComponent",
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
    framework: "react",
    uiKit: "flowbite",
  },
  backend: {
    framework: "nest",
    jwtSecret: JWT_SECRET,
    database: {
      provider: "mongodb",
      connectionString:
        `mongodb+srv://kunlatek:${DATABASE_PASSWORD}@cluster0.b0pfr.mongodb.net/movie-v1`,
      credentials: {
        databaseName: "movie-v1",
        username: "kunlatek",
        password: DATABASE_PASSWORD,
        host: "cluster0.b0pfr.mongodb.net",
      },
    },
    storage: {
      provider: "gcs",
      credentials: {
        clientEmail:
          "rapida-personal@rapida-personal-projects.iam.gserviceaccount.com",
        privateKey: STORAGE_PRIVATE_KEY,
        projectId: "rapida-personal-projects",
      },
      publicBucketName: "rapida-public-files",
      privateBucketName: "rapida-private-files",
    },
    logging: {
      discordWebhookUrl: DISCORD_WEBHOOK_URL,
    },
    email: {
      smtpUser: "noreply.rapida@gmail.com",
      smtpPass: SMTP_PASSWORD,
      smtpFrom: "noreply@kunlatek.com",
    },
    baseUrl: "http://localhost:5173",
  },
  modules: [
    movieModule,
    actorModule,
    characterModule,
  ],
  styles: [
    {
      themeName: "light",
      main: {
        headerHeight: "60px",
        typography: {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        },
        colors: {
          primary: "#4F46E5",
          primaryContrast: "#FFFFFF",
          secondary: "#6B7280",
          secondaryContrast: "#FFFFFF",
          background: "#FFFFFF",
          error: "#DC2626",
          success: "#16A34A",
          warning: "#D97706",
        },
        shadows: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
        borders: {
          radius: "4px",
        },
        components: {
          input: {
            text: "#111827",
            background: "#F9FAFB",
            border: "#D1D5DB",
            borderRadius: "4px",
            focusBorder: "#4F46E5",
            placeholder: "#9CA3AF",
            width: "248px",
          }
        },
        spacing: "8px",
        maxWidth: "1200px",
        footerHeight: "60px",
      }
    }
  ],
  dashboard: [
    movieGenreChart,
  ]
};
