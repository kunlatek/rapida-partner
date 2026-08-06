export type TAgentSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object";

export interface IAiAgentConfig {
  agentIdentity: {
    name: string;

    // LITERAL markdown content of the system prompt — NOT a file path.
    // Example: "## Identidade\n\nVocê é a ...". When non-empty it is
    // written verbatim to prompts/system.template.md. When empty (""), the
    // code generator emits a default prompt scaffold including a tools
    // table built from the fixed tools and the exposedContracts.
    systemPromptTemplate: string;

    // Relative path (inside the generated agent) where the knowledge
    // base markdown file is written and read from (e.g.
    // "data/knowledge.md").
    knowledgeBaseFile: string;

    // Optional brand/company name used by the default prompt scaffold.
    // Falls back to the project title when omitted.
    companyName?: string;

    // Optional mission statement used by the default prompt scaffold.
    mission?: string;

    // Optional initial content for the knowledge base file. When
    // omitted, a fill-in skeleton is generated.
    knowledgeBaseContent?: string;
  };

  infrastructure: {
    // "instagram" is a stub today: the generated webhook accepts the
    // request but does not process incoming messages yet. Prefer
    // "whatsapp"/"telegram" until it is implemented.
    messengers: ("whatsapp" | "instagram" | "telegram")[];
    aiProvider: "deepseek" | "gemini" | "openai";
    model: string;
  };

  businessContext: {
    targetBackendProjectId: string;

    // Optional path to an ALREADY COMPILED rapidaObject.json of the target
    // backend project (NOT the .ts source — the loader parses it as JSON),
    // resolved relative to the directory of this agent's own
    // rapidaObject.json. When provided, the code generator loads this file
    // and resolves contract bindings against it in addition to the current
    // project. When omitted, contracts are resolved only from the current
    // project's modules — the simplest and only end-to-end tested setup
    // today is embedding the same modules directly in this project (see
    // katia.ts), rather than pointing at an external compiled file.
    targetBackendDefinitionFile?: string;

    // exposedContracts only covers *additional* domain actions. The agent
    // always ships fixed tools (identity + appointment/agenda + knowledge
    // base) that hit hardcoded endpoints (/people, /appointments,
    // /availability-schedules) regardless of what is declared here — do not
    // redeclare a binding with the same toolName as a fixed tool
    // (cadastrar_usuario, atualizar_status_usuario, atualizar_telefone_usuario,
    // atualizar_email_usuario, atualizar_genero_usuario, checar_disponibilidade,
    // criar_evento, meus_agendamentos, cancelar_agendamento,
    // consultar_base_conhecimento). Also note: for "update"/"getById"/
    // "softDelete"/"hardDelete" actions the generator already injects a
    // generic required "id" tool parameter — do not add your own id/_id
    // entry to formFields, it will create a duplicate, unused parameter.
    //
    // The target backend also needs a dedicated user account for the bot to
    // authenticate against (BOT_API_EMAIL/BOT_API_PASSWORD in the generated
    // .env) — this is separate from flows.invitation.mainUserEmail and must
    // be provisioned manually on the target backend.
    exposedContracts: IAgentContractBinding[];
  };

  // Optional background jobs configuration. Values become the generated
  // defaults of the agent's job services and can still be overridden at
  // runtime through each service's updateConfig method.
  jobs?: {
    reminder?: {
      // Defaults to true. The reminder job is only generated when the
      // whatsapp messenger is active.
      enabled?: boolean;
      // Cron expression. Defaults to "*/2 * * * *".
      cronInterval?: string;
      // How many minutes ahead of the appointment the reminder fires.
      // Defaults to 1440 (24 hours).
      minutesAhead?: number;
      // IANA timezone for the cron scheduler.
      // Defaults to "America/Sao_Paulo".
      timezone?: string;
    };
  };
}

export interface IAgentContractBinding {
  contractId: string;

  toolName: string;

  action: "create" | "get" | "getById" | "update" | "softDelete" | "hardDelete";

  intentMapping: {
    formFields: {
      fieldId: string;

      naturalLanguagePrompt: string;

      validationHint?: string;

      // Optional explicit JSON-Schema type for the generated tool
      // parameter. When provided it takes precedence over the code
      // generator's defensive EDataType-to-schema mapping, making the
      // tool parameter typing independent from the enum values.
      schemaType?: TAgentSchemaType;
    }[];

    triggerKeywords: string[];
  };

  responseTemplate?: {
    successMessage: string;
    errorMessage: string;
  };
}
