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

    // Content of the system prompt (markdown). When non-empty it is
    // written verbatim to prompts/system.template.md. When empty, the
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
    messengers: ("whatsapp" | "instagram" | "telegram")[];
    aiProvider: "deepseek" | "gemini" | "openai";
    model: string;
  };

  businessContext: {
    targetBackendProjectId: string;

    // Optional path to the target backend project definition file
    // (rapidaObject.json). When provided, the code generator loads this
    // file and resolves contract bindings against it in addition to the
    // current project. When omitted, contracts are resolved only from
    // the current project's modules.
    targetBackendDefinitionFile?: string;

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
