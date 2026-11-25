import type { IAiAgentConfig } from "./ai-agent.interface";
import type { IDataCard } from "./data-card.interface";
import type { IDataChart } from "./data-chart.interface";
import type { IDataDetail } from "./data-detail.interface";
import type { IDataStat } from "./data-stat.interface";
import type {
  IDashboardBudgetMonitor,
  IDashboardQuickCreate,
  IQuickCreateItem,
} from "./dashboard-widget.interface";
import type { IDataGrid } from "./data-grid.interface";
import type { IDataTable } from "./data-table.interface";
import type { IE2e } from "./e2e.interface";
import type { IFlowChart } from "./form-flowchart.interface";
import type { IForm } from "./form.interface";
import type { IKanban } from "./kanban.interface";
import type { TLanguage } from "./language.interface";
import type { IPanel } from "./layout-panel.interface";
import type { IList } from "./list.interface";
import type { INotification } from "./notification.interface";
import type { IBackend } from "./project-backend.interface";
import type { IProjectRepositories } from "./project-repositories.interface";
import type { IStyle } from "./project-style.interface";
import type { TTranslatable } from "./translatable.interface";
import type { IProjectStore, TStoreSegment } from "./store-settings.interface";
import type { IReferralCuration } from "./referral-curation.interface";

export interface IProject {
  id: string;
  title: string;
  description: string;
  businessPlan?: IBusinessPLan;
  businessRules?: IBusinessRule[];
  // "ecommerce": loja de um único vendedor (o dono dos dados da instância).
  // "marketplace": vários vendedores; enquanto a camada multivendedor não existe,
  // o rapida-code-generator gera para os dois o mesmo núcleo de loja.
  // "referralCommerce": vitrine sem venda própria; cada produto leva por link de
  // afiliado para o anúncio na fonte de origem (IBackend.referralSources), com
  // a curadoria de IProject.referralCuration. Requer suporte no gerador.
  // "aiAgent": sinônimo de "backoffice" (mesmo painel). O agente de IA não
  // depende do skeleton: é gerado sempre que aiAgentConfig existe.
  skeleton:
    | "backoffice"
    | "ecommerce"
    | "marketplace"
    | "referralCommerce"
    | "landingPage"
    | "socialNetwork"
    | "service"
    | "aiAgent";
  // Idiomas em que os textos TTranslatable (label, placeholder, tooltip, title)
  // são declarados. Sem languages, o projeto é monolíngue em defaultLanguage.
  languages?: TLanguage[];
  defaultLanguage?: TLanguage;
  flows?: {
    authentication?: boolean;
    registrationMethod?: 'link' | 'code';
    resetPasswordMethod?: 'link' | 'code';
    permission?: boolean;
    invitation?: {
      mainUserEmail: string; // First user email to own the system and be the first invited
    };
    registration?: boolean;
    profiles?: {
      personProfile?: IForm;
      companyProfile?: IForm;
    };
  };
  frontend?: IFrontend[];
  backend?: IBackend[];
  deepseekIntegration?: {
    apiKey: string;
    service: "embedding" | "chat" | "custom" | "cost";
  }[];
  // Chave do Gemini (Google AI). Hoje só o agente de IA usa, quando
  // aiAgentConfig.infrastructure.aiProvider é "gemini" (GEMINI_API_KEY do
  // .env gerado).
  geminiIntegration?: {
    apiKey: string;
    service: "chat";
  }[];
  openaiIntegration?: {
    apiKey: string;
    // "transcription": speech-to-text (Whisper) used by aiAgent projects to
    // transcribe incoming audio messages.
    service: "embedding" | "chat" | "custom" | "cost" | "transcription";
  }[];
  mongodbIntegration?: {
    accountPublicKey?: string;
    accountPrivateKey?: string;
    organizationId?: string;
    groupId?: string;
    processId?: string;
    service: "embedding" | "chat" | "custom" | "cost";
  }[];
  e2e?: IE2e;
  modules?: IModule[];
  // Grupos do menu lateral para as telas que não vêm de módulos. Use o mesmo
  // texto de um IModule.menuGroup para juntá-las a esse grupo.
  menu?: {
    homeGroup?: TTranslatable; // grupo do Painel (/); sem ele, fica solto no topo
    flowsGroup?: TTranslatable; // membros, papéis, convites e notificações, como links soltos no grupo
    // Atalhos de criação: botão "Criar novo" no painel e card IDashboardQuickCreate.
    quickCreate?: IQuickCreateItem[];
  };
  styles?: IStyle[];
  flowChart?: IFlowChart;
  dashboard?: TDashboardItem[];
  // Agente de IA (Kunlatalk) do projeto. Com ele, o gerador cria o agente em
  // qualquer skeleton (ex.: um backoffice ou uma loja com atendente), além do
  // frontend e do backend.
  aiAgentConfig?: IAiAgentConfig;
  notifications?: INotification[];
  repositories?: IProjectRepositories;
  // Só para skeleton "ecommerce"/"marketplace": funcionalidades opcionais
  // geradas e valores iniciais da configuração da loja.
  store?: IProjectStore;
  // Só para skeleton "referralCommerce": filtros e desempate dos produtos exibidos.
  referralCuration?: IReferralCuration;
}

export interface IFrontend {
  environment: string;
  baseUrl: string;
  apiBaseUrl: string;
  isActiveEnvironment: boolean;
  framework: "angular" | "flutter" | "react" | "reactnative" | "svelte" | "vue";
  uiKit: "antdesign" | "bootstrap" | "material" | "flowbite";
  logoPath?: string;
  faviconPath?: string;
  isSsr?: boolean;
}

interface IBusinessPLan {
  businessValue: string;
  targetMarket: string;
  benchmarkings: string;
  legalIssues: string;
  ethicalIssues: string;
  afterSales: string;
  monetization?: string;
}

/**
 * Para `codeStartLocationReference` em qualquer `backendComplementaryCode`/`frontendComplementaryCode`
 * (rule ou subrule): "before"/"after" inserem `code` como linha(s) inteira(s) imediatamente antes/depois
 * da PRIMEIRA LINHA onde `codeStartLocation` foi encontrado — não depois da última linha do match, mesmo
 * quando `codeStartLocation` tem várias linhas. Um `codeStartLocation` multi-linha serve só para garantir
 * que o trecho seja único na árvore gerada; ele não pula o conteúdo casado até o fim antes de inserir.
 * Para ancorar a inserção num ponto específico, a primeira linha de `codeStartLocation` precisa já ser
 * essa linha (estendendo o texto para frente, se necessário, só para ganhar unicidade).
 * "replace" substitui exatamente o trecho casado (substring, não a linha inteira) pelo `code`.
 *
 * `dependencies`/`devDependencies`: pacotes npm que o `code` usa, nome -> versão exata (ex.:
 * `{ exceljs: "4.4.0" }`). O gerador soma ao package.json do lado correspondente quando o `framework`
 * bate com o ativo na geração; se o pacote já existir no template com outra versão, mantém a do
 * template e avisa.
 *
 * `files`: arquivos novos que o código complementar cria no projeto gerado (ex.: testes unitários,
 * fixtures), quando o `framework` bate com o ativo. `path` é relativo à raiz do projeto gerado, sem
 * `..` e sem caminho absoluto; a geração falha se o arquivo já existir (gerado pelo template ou por
 * outra regra), para nunca sobrescrever código gerado em silêncio.
 */
export interface IComplementaryFile {
  path: string;
  content: string;
}

export interface IBusinessRule {
  rule: {
    description: string;
    subrules?: {
      description: string;
      implementation?: {
        type: "frontend" | "backend" | "both";
        details: string;
      };
      backendComplementaryCode?: {
        framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
        code: {
          codeStartLocationReference: "before" | "after" | "replace";
          codeStartLocation: string;
          code: string;
        }[];
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        files?: IComplementaryFile[];
      };
      frontendComplementaryCode?: {
        framework:
          | "angular"
          | "flutter"
          | "react"
          | "reactnative"
          | "svelte"
          | "vue";
        code: {
          codeStartLocationReference: "before" | "after" | "replace";
          codeStartLocation: string;
          code: string;
        }[];
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        files?: IComplementaryFile[];
      };
    }[];
    implementation?: {
      type: "frontend" | "backend" | "both";
      details: string;
    };
    backendComplementaryCode?: {
      framework: "functions" | "lambda" | "laravel" | "nest" | "dotnet";
      code: {
        codeStartLocationReference: "before" | "after" | "replace";
        codeStartLocation: string;
        code: string;
      }[];
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      files?: IComplementaryFile[];
    };
    frontendComplementaryCode?: {
      framework:
        | "angular"
        | "flutter"
        | "react"
        | "reactnative"
        | "svelte"
        | "vue";
      code: {
        codeStartLocationReference: "before" | "after" | "replace";
        codeStartLocation: string;
        code: string;
      }[];
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      files?: IComplementaryFile[];
    };
  };
}

export interface IModule {
  id: string;
  title: TTranslatable;
  icon: string;
  // Grupo do menu lateral: módulos com o mesmo menuGroup aparecem juntos sob
  // esse cabeçalho, na posição do primeiro deles. Sem menuGroup, o módulo fica
  // fora de grupo, como sempre foi (link solto com 1 tela, seção com várias).
  menuGroup?: TTranslatable;
  // "section" (padrão): com várias telas, o módulo vira um item recolhível.
  // "flat": cada tela do módulo vira um link solto no menu (ou no menuGroup).
  menuDisplay?: "section" | "flat";
  // Quadro de pedidos do vendedor (Fase 8): no módulo de pedidos da loja
  // (getStoreOrdersModule), o gerador cria as rotas e a tela do quadro.
  storeOrdersBoard?: IStoreOrdersBoard;
  components: IComponent[];
  businessRules?: IBusinessRule[];
  todo?: ITodo[];
}

/**
 * Quadro de pedidos do vendedor (Fase 8). retail e food ganham o Quadro
 * (etapas e histórico); services e events, a Agenda (sessões e check-in).
 */
export interface IStoreOrdersBoard {
  segment: TStoreSegment;
  // Configuração da loja no backoffice, para o selo "Recebendo pedidos" seguir o horário. Padrão "/store-settings".
  settingsEndpoint?: string;
}

export interface ITodo {
  title: string;
  description: string;
}

export type IComponent =
  | IForm
  | IList
  | IKanban
  | IDataTable
  | IDataCard
  | IDataGrid
  | IDataDetail
  | IDataChart
  | IDataStat
  | IPanel;

/**
 * Item de IProject.dashboard: qualquer IComponent ou um widget que só existe
 * no painel (budgetMonitor, quickCreate).
 */
export type TDashboardItem =
  | IComponent
  | IDashboardBudgetMonitor
  | IDashboardQuickCreate;
