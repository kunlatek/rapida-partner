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
    // table built from the active fixed tools and the exposedContracts.
    //
    // Placeholders (plain text, not JS interpolation):
    // - {{ASSISTANT_NAME}}: agentIdentity.name, replaced at runtime;
    // - {{CURRENT_DATE}}: current date/time (pt-BR), replaced at runtime;
    // - {{USER_NAME}}: the user's name from the session, replaced at runtime;
    // - {{TOOLS_TABLE}}: replaced at generation time by the table of the
    //   tools actually generated (active fixed tools + exposedContracts).
    //   Prefer it over a hand-written tool list, which goes stale silently.
    // The generator warns when a literal prompt cites a tool that does not
    // exist, or (without {{TOOLS_TABLE}}) omits a generated tool.
    systemPromptTemplate: string;

    // Relative path (inside the generated agent) where the knowledge
    // base markdown file is written and read from. Defaults to
    // "data/knowledge.md".
    knowledgeBaseFile?: string;

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
    // The provider key comes from the project integrations, always with
    // service "chat": deepseekIntegration, geminiIntegration or
    // openaiIntegration. The code generator warns when it is missing (the
    // generated .env would ship an empty key).
    aiProvider: "deepseek" | "gemini" | "openai";
    // Model name sent to the provider. Known values (the generator warns on
    // anything else): deepseek → "deepseek-chat", "deepseek-reasoner";
    // gemini → "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro";
    // openai → "gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1".
    model: string;
  };

  businessContext: {
    // Not used by the code generator today (kept only for compatibility).
    // Contracts come from this project's modules and, optionally, from
    // targetBackendDefinitionFile.
    targetBackendProjectId?: string;

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
    // ships fixed tools according to `capabilities` (identity → /people,
    // scheduling → /appointments and /availability-schedules, knowledge base,
    // media) plus the handoff tool when humanHandoff has contacts. Their names
    // are reserved — a binding with one of them fails code generation, as does
    // a toolName repeated between bindings: cadastrar_usuario,
    // atualizar_status_usuario, atualizar_telefone_usuario,
    // atualizar_email_usuario, atualizar_genero_usuario,
    // checar_disponibilidade, criar_evento, meus_agendamentos,
    // cancelar_agendamento, consultar_base_conhecimento, mostrar_imagem,
    // escalar_para_humano. Also note: for "update"/"getById"/
    // "softDelete"/"hardDelete" actions the generator already injects a
    // generic required "id" tool parameter — do not add your own id/_id
    // entry to formFields, it will create a duplicate, unused parameter.
    //
    // Besides the fixed tools, the agent itself stores and reads the
    // conversation history at /whatsapp-chat-histories: some module of the
    // project (or of targetBackendDefinitionFile) must expose that endpoint —
    // usually whatsappModule from rapida-projects. Code generation fails
    // without it.
    //
    // The target backend also needs a dedicated user account for the bot to
    // authenticate against (see botCredentials below) — this is separate from
    // flows.invitation.mainUserEmail and must be provisioned manually on the
    // target backend.
    exposedContracts: IAgentContractBinding[];

    // Credentials of the dedicated bot user on the target backend (written to
    // BOT_API_EMAIL/BOT_API_PASSWORD in the generated agent .env). The account
    // itself still has to be provisioned on the target backend. Import the
    // values from constants/secrets — never write them literally in a project.
    botCredentials?: {
      email: string;
      password: string;
    };
  };

  // Groups of fixed tools the agent ships. Each one defaults to true when
  // omitted, so leaving the block out keeps every fixed tool. A disabled
  // group is not generated, not offered to the LLM, left out of the default
  // prompt and of the endpoint check.
  // - identity: cadastrar_usuario and atualizar_*_usuario (/people), plus
  //   recognizing a returning user by WhatsApp id;
  // - scheduling: checar_disponibilidade, criar_evento, meus_agendamentos,
  //   cancelar_agendamento (/appointments, /availability-schedules) and the
  //   appointment reminder job (needs identity);
  // - knowledgeBase: consultar_base_conhecimento and the knowledge file;
  // - media: mostrar_imagem.
  capabilities?: {
    identity?: boolean;
    scheduling?: boolean;
    knowledgeBase?: boolean;
    media?: boolean;
  };

  // Optional human handoff: when present with at least one contact, the
  // code generator adds a fixed tool ("escalar_para_humano") that sends a
  // WhatsApp text message (summary generated by the LLM itself + the name/
  // contact of who it was talking to, taken from the current session —
  // never asked as a tool argument, to avoid the LLM guessing/inventing a
  // phone number) to one of the configured contacts' whatsappPhoneNumber.
  // The agent keeps responding the original user normally after the
  // handoff — this is a parallel notification to a human, not a channel
  // switch/handover of the conversation itself. The notification always goes
  // through the WhatsApp messenger (it must be active), whatever channel the
  // conversation came from. Meta only delivers it if the contact messaged the
  // agent's number in the last 24 h (same rule as the reminder; a template is
  // not supported here yet).
  humanHandoff?: {
    contacts: IHumanHandoffContact[];
  };

  // Optional limits for incoming audio messages (transcribed through the
  // project's openaiIntegration with service "transcription"). Without that
  // key audio stays off: the agent answers that it cannot process audio, and
  // the code generator warns.
  audio?: {
    // Longer audios are rejected before download/transcription.
    // Defaults to 300.
    maxDurationSeconds?: number;
    // Minimum interval between two audios from the same user.
    // Defaults to 10.
    rateLimitIntervalSeconds?: number;
  };

  // Optional background jobs configuration. Values become the generated
  // defaults of the agent's job services and can still be overridden at
  // runtime through config/rules.json.
  jobs?: {
    // Appointment reminder sent through WhatsApp. Frequency and timezone live
    // in IBackend.scheduledJobs (id "aiAgentAppointmentReminder"), per
    // environment; the timezone is also the one appointment times are stored
    // in.
    reminder?: {
      // Defaults to true. The reminder job is only generated when the
      // whatsapp messenger is active.
      enabled?: boolean;
      // How many minutes ahead of the appointment the reminder fires.
      // Defaults to 1440 (24 hours).
      minutesAhead?: number;
      // Who gets the reminder: the person who booked ("client",
      // appointment.personId) and/or the professional ("professional",
      // first of appointment.involvedPeopleId). Defaults to both.
      recipients?: TAppointmentReminderRecipient[];
      // WhatsApp message templates approved in Meta's WhatsApp Manager, one
      // per recipient. Meta only delivers free text up to 24 h after the
      // recipient's last message to this number; outside that window only an
      // approved template is delivered. Without a template the agent sends
      // free text (and the code generator warns).
      whatsappTemplates?: {
        // Body parameters, in order: {{1}} client name, {{2}} date
        // (dd/mm/aaaa), {{3}} time (HH:mm), {{4}} professional name.
        client?: IWhatsappMessageTemplate;
        // Body parameters, in order: {{1}} professional name, {{2}} date
        // (dd/mm/aaaa), {{3}} time (HH:mm), {{4}} client name, {{5}} client
        // phone.
        professional?: IWhatsappMessageTemplate;
      };
    };
  };
}

export type TAppointmentReminderRecipient = "client" | "professional";

export interface IWhatsappMessageTemplate {
  // Template name exactly as approved in WhatsApp Manager.
  name: string;
  // Template language code. Defaults to "pt_BR".
  languageCode?: string;
}

export interface IAgentContractBinding {
  contractId: string;

  toolName: string;

  // Text the LLM reads to decide when to call this tool. Takes precedence
  // over the contract's userStory; the generator warns when neither exists.
  description?: string;

  // For getById/update/softDelete/hardDelete: where the LLM gets the record
  // id from (e.g. "use o id retornado por consultar_reserva, nunca o CPF").
  // Without it the tool only says "Identificador único do registro alvo".
  idPrompt?: string;

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

export interface IHumanHandoffContact {
  // Human-readable identifier the LLM uses to pick this contact
  // (e.g. "Júlia"). Must be unique within humanHandoff.contacts.
  name: string;

  // Free text describing when/why this contact should receive the
  // handoff (e.g. "fecha reservas quando o hóspede confirma uma data
  // disponível"). The LLM matches the escalation reason against this
  // text to pick the right contact — same spirit as triggerKeywords
  // above, not a fixed enum of categories.
  useCase: string;

  // E.164 phone number (e.g. "+558296539080") that receives the
  // WhatsApp text message on handoff. Validated by the schema.
  whatsappPhoneNumber: string;
}
