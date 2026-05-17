import { DATABASE_PASSWORD } from "../../constants/secrets/database";
import { DISCORD_WEBHOOK_URL, JWT_SECRET, SMTP_PASSWORD } from "../../constants/secrets/others";
import { STORAGE_PRIVATE_KEY } from "../../constants/secrets/storage";
import { EDataType } from "../../enums/form.enum";
import type { IProject } from "../../interfaces/project.interface";
import { movieGenreChart } from "../components/charts/movieGenre.chart";
import { companyForm } from "../components/forms/company.form";
import { personForm } from "../components/forms/person.form";
import { actorModule } from "../modules/actor";
import { characterModule } from "../modules/character";
import { movieModule } from "../modules/movie";
import { productModule } from "../modules/product";

export const movieCommerce: IProject = {
  id: "movieCommerce",
  title: "Movie Commerce",
  description: "Sistema de gerenciamento de comercio para merchandising de filmes e personagens.",
  skeleton: "marketplace",
  flows: {
    authentication: true,
    permission: true,
    registration: true,
    profiles: {
      personProfile: personForm,
      companyProfile: companyForm,
    }
  },
  businessPlan: {
    businessValue: "Gerenciar e otimizar as operações do Movie Commerce.",
    targetMarket: "Empresas que utilizam o Movie Commerce para gerenciar sugestões e feedbacks.",
    benchmarkings: "Análise de sistemas de gerenciamento de feedbacks.",
    legalIssues: "Conformidade com leis de proteção de dados.",
    ethicalIssues: "Garantir a privacidade dos usuários.",
    afterSales: "Suporte contínuo e atualizações regulares.",
    monetization: "Assinaturas mensais para acesso ao sistema.",
  },
  frontend: {
    framework: "angular",
    uiKit: "flowbite",
  },
  backend: {
    framework: "nest",
    jwtSecret: JWT_SECRET,
    database: {
      provider: "mongodb",
      connectionString:
        `mongodb+srv://kunlatek:${DATABASE_PASSWORD}@cluster0.b0pfr.mongodb.net/movie-commerce-v1`,
      credentials: {
        databaseName: "movie-commerce-v1",
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
    marketplace: {
      paymentGateways: [
        {
          provider: "mercadoPago",
          apiKey: "sk-1234567890abcdef1234567890abcdef",
        },
      ],
      productsAutocomplete: {
        type: "autocomplete",
        name: "productId",
        dataType: EDataType.UNIQUEIDENTIFIER,
        label: "Produto",
        optionsApi: {
          endpoint: "http://localhost:3001/products",
          labelField: ["name", "ean13", "ean14"],
          valueField: "_id",
          paramsToFilter: ["name", "ean13", "ean14"],
          paramType: "query",
          relatedEntity: "products",
          isExternal: true,
        },
      },
    },
    baseUrl: "http://localhost:4200",
  },
  // e2e: {
  //   framework: "playwright",
  //   moduleId: movieModule.id,
  // },
  modules: [
    productModule,
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
