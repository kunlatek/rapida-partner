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
    framework: "react",
    uiKit: "flowbite",
  },
  backend: {
    framework: "nest",
    jwtSecret: "Kunl4t3kw1llN3v3rD13",
    database: {
      provider: "mongodb",
      connectionString:
        "mongodb+srv://kunlatek:Kunlatek751@cluster0.b0pfr.mongodb.net/movie-v1",
      credentials: {
        databaseName: "movie-v1",
        username: "kunlatek",
        password: "Kunlatek751",
        host: "cluster0.b0pfr.mongodb.net",
      },
    },
    storage: {
      provider: "gcs",
      credentials: {
        clientEmail:
          "rapida-personal@rapida-personal-projects.iam.gserviceaccount.com",
        privateKey:
          "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCDEQRUfKKxYUj\nVorX+aiEHhPRrrcNHVw40qq517wP7IgIp2UlA5uf0rV2cdn1njA9RMQxp6l7Qt+0\nBZg1JZM8l9Uv1SckRlkKST4k2B3MDOEl1riAPxIE/jBCUT9l2DCbir0Nu+CqGhGD\nUXOMpF0XWYL9GIBRo8Paf//yU0b86VBDfQGgnFkMKFq3bVDkPd8hQTBgTFT5F1Rh\nDcoUpAp/n3SYxkAK1V7Je+fnChF1DQPj8Nd5CLm4DsCM1B+HtaegsaE1ulXwhi1J\nlIFFGv49g0f2qOs3hytTPt0d8UpxFd9/Oq0tmcjuzK4bYzJdVZZPf+4xflHz+6R8\n2o7grTeDAgMBAAECggEABHdsz6s/tnMCdARHcN41w0i/8wke/IXK/CHZPSrakNFE\ndlKIEPiKyfx7Ic1QE4e/G4HsNCpkS8qHxKiGTt7dCz2BcjbpTjvyS7rQ298/nFVF\nj23oVEdfXk8NhFFDcNAvmjzwyhKjgrbT5V5oFvonjGSKj9HTDk4DMZHVrdm93g9k\nZ9XJBVeLh14/rkZLMDZ9DVjUMiQ6xElMH3IQD4MwEcul9eqM8bs2APgZlzzfO76m\nAuq20l4JqOcJJl8wzC7z12eNDNJrQNh2sHsT9zV5PabfNoQhnU6fDvKr0PG0PGRR\nS5PTDeiMY47rJVPgwxthSke3abtdgA9SNie8OqZl6QKBgQD+yFT+ndFYKvHg2WNi\ns0jK0QqFQB84LQtOX2YhQ0137mtSv0z7wO90e28dfUqsjax4DxPMp+AW0cC3SBEv\n2T8/rJrgzGucPt4Jzml5HYl2NgCkNAtHIJ1vtXJdX5d3WmYhH7cUTPmV6nMS8OlF\nheSyfudCiOo89phQf0pI6lhQKwKBgQDC+aOU2cxMVA5VH0txX0G9tPQjBvzY09ev\nVLGrxlmdAcQVXYCWdoESEfTv3E4JPklAz5B2/XnALxM5ewJgjoP6buOCJrQcgJNC\nSsG9Ll3zF4c+opFmaYTzcAY9HWHa4Pc+GAxFrrcPGzVBLjSrl7FPdykkPiBNxNJa\nnOzzrL4yCQKBgQC7b/pHjycx6/YiawuY0zjcLMnGmhPdqhXFRJ3IHtFhR/+g0qf6\nFkiTszNdyI0lQNz/PmhciaxsXUegDt7GCtdjKsKOWxVXz1BeeoJR3g8A7l2ub7NU\nUoRAaIaIdwjhf5nfCIwR3UdIqUCbUKzsvsIvJvlPk5Zv3yLTJbIqzmzGHQKBgBiQ\nnUSGwE+pk3i0DaxGBSFiqBO1sKuc3SLQ9+WdgvLeIxdSBX5vhcmCC6sgxZAykcYh\noKDtRKarB7AJSH5j1kr6J53hRHYG2QbUJl6wddPH1hlVIB6YEtEc/xw6FHcgOuZO\n31T0M0oq8mW47Zfk78kESWGwlh9WOe6CsPPugrQJAoGBAP3o8DqH1Pb7vlowsz78\n8fsCuydEJgsPSwHHqBveeUHBQLGSiGIIKRXWR1a13mWXQTqQkROZCwvVCMX6FHZZ\nKv3rzgsTkaaoqM0RVLcQSSDoyu2yP/JJv+VYsvMf2S3dUkDAeYDZFizPeFF42t92\n+MSId41OkBvJ/JvqsBWlWFYK\n-----END PRIVATE KEY-----\n",
        projectId: "rapida-personal-projects",
      },
      publicBucketName: "rapida-public-files",
      privateBucketName: "rapida-private-files",
    },
    logging: {
      discordWebhookUrl:
        "https://discord.com/api/webhooks/1370095507959054429/Ay8pIM-sinbjsLMAAWGrRDFT-oyBD3xu7yB2Ke0Bx6RxpKN882taB4_tkD2xsdk8MirZ",
    },
    email: {
      smtpUser: "noreply.rapida@gmail.com",
      smtpPass: "ekgwxlazvjjllfxf",
      smtpFrom: "noreply@kunlatek.com",
    },
    baseUrl: "http://localhost:5173",
  },
  modules: [
    personModule,
    companyModule,
    movieModule,
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
  ]
};
