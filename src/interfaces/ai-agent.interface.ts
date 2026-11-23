export type TAgentSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object";

// Agente de IA (Kunlatalk) do projeto: persona, canal, motor, o que ele pode
// fazer no backend e rotinas. O gerador cria o agente sempre que este bloco
// existe, em qualquer skeleton (IProject.aiAgentConfig).
export interface IAiAgentConfig {
  agentIdentity: {
    name: string;

    // Conteúdo LITERAL do system prompt em markdown, não um caminho de
    // arquivo. Exemplo: "## Identidade\n\nVocê é a ...". Preenchido, vai tal
    // qual para prompts/system.template.md. Vazio (""), o gerador monta um
    // prompt padrão com a tabela das tools fixas ativas e de exposedContracts.
    //
    // Placeholders (texto simples, não interpolação JS):
    // - {{ASSISTANT_NAME}}: agentIdentity.name, trocado em runtime;
    // - {{CURRENT_DATE}}: data e hora atuais (pt-BR), trocado em runtime;
    // - {{USER_NAME}}: nome do usuário na sessão, trocado em runtime;
    // - {{TOOLS_TABLE}}: trocado na geração pela tabela das tools realmente
    //   geradas (fixas ativas + exposedContracts). Prefira a uma lista
    //   escrita à mão, que fica desatualizada sem aviso.
    // O gerador avisa quando um prompt literal cita uma tool que não existe
    // ou, sem {{TOOLS_TABLE}}, deixa de citar uma tool gerada.
    systemPromptTemplate: string;

    // Caminho relativo (dentro do agente gerado) do arquivo markdown da base
    // de conhecimento. Padrão: "data/knowledge.md".
    knowledgeBaseFile?: string;

    // Nome da marca/empresa usado pelo prompt padrão. Sem ele, vale o título
    // do projeto.
    companyName?: string;

    // Missão usada pelo prompt padrão.
    mission?: string;

    // Conteúdo inicial da base de conhecimento. Sem ele, sai um esqueleto
    // para preencher.
    knowledgeBaseContent?: string;
  };

  infrastructure: {
    // Ao menos um. "whatsapp" usa backend[].aiAgentWhatsapp (Meta Cloud API);
    // "telegram" usa backend[].telegram.telegramBotToken e ainda não foi
    // validado em conversa real.
    messengers: ("whatsapp" | "telegram")[];
    // A chave do provedor vem das integrações do projeto, sempre com
    // service "chat": deepseekIntegration, geminiIntegration ou
    // openaiIntegration. Sem ela a geração falha.
    aiProvider: "deepseek" | "gemini" | "openai";
    // Nome do modelo enviado ao provedor. Valores conhecidos (o gerador
    // avisa para outros): deepseek → "deepseek-chat", "deepseek-reasoner";
    // gemini → "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro";
    // openai → "gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1".
    model: string;
  };

  businessContext: {
    // Backend em OUTRO projeto Rapida (ex.: um ERP separado). Sem ele, o
    // agente conversa com o backend do próprio projeto (backend[] e modules).
    // Com ele, o agente chama só o backend alvo:
    // - definitionFile: rapidaObject.json JÁ COMPILADO do projeto alvo (não o
    //   .ts), relativo ao diretório do rapidaObject.json deste agente.
    //   Contratos, endpoints das tools fixas e histórico vêm só dele.
    // - baseUrl: URL do backend alvo (com ou sem /api/v1), gravada em
    //   BOT_API_BASE_URL.
    // O usuário do bot (botCredentials) precisa existir no backend alvo: o
    // backend deste projeto não o cria quando há targetBackend.
    targetBackend?: {
      definitionFile: string;
      baseUrl: string;
    };

    // exposedContracts cobre só as ações de domínio *adicionais*. O agente
    // traz tools fixas conforme `capabilities` (identity → /people,
    // scheduling → /appointments e /availability-schedules, base de
    // conhecimento, mídia) e a tool de escalada quando humanHandoff tem
    // contatos. Os nomes são reservados — um binding com um deles falha a
    // geração, assim como um toolName repetido entre bindings:
    // cadastrar_usuario, atualizar_status_usuario, atualizar_telefone_usuario,
    // atualizar_email_usuario, atualizar_genero_usuario,
    // checar_disponibilidade, criar_evento, meus_agendamentos,
    // cancelar_agendamento, consultar_base_conhecimento, mostrar_imagem,
    // escalar_para_humano. Nas ações "update"/"getById"/"softDelete"/
    // "hardDelete" o gerador já injeta o parâmetro obrigatório "id" (descrito
    // por idPrompt): não repita id/_id em formFields.
    //
    // Além das tools fixas, o próprio agente grava e lê o histórico de
    // conversa em /whatsapp-chat-histories: algum módulo do projeto (ou do
    // targetBackend) precisa expor esse endpoint — normalmente o
    // whatsappModule do rapida-projects. Sem ele a geração falha.
    //
    // O agente se autentica no backend com um usuário de serviço próprio
    // (botCredentials, abaixo), separado de flows.invitation.mainUserEmail.
    exposedContracts: IAgentContractBinding[];

    // Credenciais do usuário de serviço do agente (BOT_API_EMAIL/
    // BOT_API_PASSWORD no .env do agente e do backend). O backend Nest gerado
    // cria esse usuário ao subir — de forma idempotente, alinhando a senha com
    // o .env — no workspace de flows.invitation.mainUserEmail, com o papel
    // "aiAgent" limitado às entidades que as tools usam. Importe os valores
    // de constants/secrets; nunca escreva literalmente.
    botCredentials: {
      email: string;
      password: string;
    };
  };

  // Grupos de tools fixas do agente. Cada um vale true quando omitido; sem o
  // bloco, todas as tools fixas são geradas. Um grupo desligado não é
  // gerado, não é oferecido ao LLM e sai do prompt padrão e da conferência
  // de endpoints.
  // - identity: cadastrar_usuario e atualizar_*_usuario (/people), e o
  //   reconhecimento de quem volta a falar pelo id do WhatsApp;
  // - scheduling: checar_disponibilidade, criar_evento, meus_agendamentos,
  //   cancelar_agendamento (/appointments, /availability-schedules) e o
  //   lembrete de agendamento (precisa de identity);
  // - knowledgeBase: consultar_base_conhecimento e o arquivo da base;
  // - media: mostrar_imagem.
  capabilities?: {
    identity?: boolean;
    scheduling?: boolean;
    knowledgeBase?: boolean;
    media?: boolean;
  };

  // Escalada para humano: com ao menos um contato, o gerador acrescenta a
  // tool fixa "escalar_para_humano", que manda uma mensagem de texto no
  // WhatsApp (resumo escrito pelo LLM + nome e contato de quem estava na
  // conversa, tirados da sessão — nunca pedidos como argumento, para o LLM
  // não inventar telefone) para o whatsappPhoneNumber do contato escolhido.
  // O agente continua atendendo normalmente: é um aviso paralelo a uma
  // pessoa, não uma passagem da conversa. O aviso sai sempre pelo mensageiro
  // WhatsApp (que precisa estar ativo), qualquer que seja o canal da
  // conversa. A Meta só entrega se o contato tiver escrito para o número do
  // agente nas últimas 24 h (mesma regra do lembrete; modelo aprovado ainda
  // não é suportado aqui).
  humanHandoff?: {
    contacts: IHumanHandoffContact[];
  };

  // Limites para áudios recebidos (transcritos pela openaiIntegration do
  // projeto com service "transcription"). Sem essa chave o áudio fica
  // desligado: o agente responde que não consegue processar áudios, e o
  // gerador avisa.
  audio?: {
    // Áudios mais longos são recusados antes do download e da transcrição.
    // Padrão: 300.
    maxDurationSeconds?: number;
    // Intervalo mínimo entre dois áudios do mesmo usuário. Padrão: 10.
    rateLimitIntervalSeconds?: number;
  };

  // Rotinas em segundo plano. Os valores viram os padrões do agente gerado e
  // ainda podem ser trocados em runtime por config/rules.json.
  jobs?: {
    // Lembrete de agendamento pelo WhatsApp. Frequência e fuso ficam em
    // IBackend.scheduledJobs (id "aiAgentAppointmentReminder"), por ambiente;
    // o fuso também é o dos horários gravados nos agendamentos.
    reminder?: {
      // Padrão: true. O lembrete só é gerado com o mensageiro whatsapp e
      // capabilities.scheduling.
      enabled?: boolean;
      // Quantos minutos antes do agendamento o lembrete sai. Padrão: 1440
      // (24 horas).
      minutesAhead?: number;
      // Quem recebe: quem agendou ("client", appointment.personId) e/ou o
      // profissional ("professional", o primeiro de
      // appointment.involvedPeopleId). Padrão: os dois.
      recipients?: TAppointmentReminderRecipient[];
      // Modelos de mensagem aprovados no WhatsApp Manager da Meta, um por
      // destinatário. A Meta só entrega texto livre até 24 h depois da
      // última mensagem do destinatário para este número; fora dessa janela,
      // só modelo aprovado. Sem modelo, o agente manda texto livre (e o
      // gerador avisa).
      whatsappTemplates?: {
        // Parâmetros do corpo, em ordem: {{1}} nome do cliente, {{2}} data
        // (dd/mm/aaaa), {{3}} hora (HH:mm), {{4}} nome do profissional.
        client?: IWhatsappMessageTemplate;
        // Parâmetros do corpo, em ordem: {{1}} nome do profissional, {{2}}
        // data (dd/mm/aaaa), {{3}} hora (HH:mm), {{4}} nome do cliente, {{5}}
        // telefone do cliente.
        professional?: IWhatsappMessageTemplate;
      };
    };
  };
}

export type TAppointmentReminderRecipient = "client" | "professional";

export interface IWhatsappMessageTemplate {
  // Nome do modelo exatamente como aprovado no WhatsApp Manager.
  name: string;
  // Código de idioma do modelo. Padrão: "pt_BR".
  languageCode?: string;
}

export interface IAgentContractBinding {
  contractId: string;

  toolName: string;

  // Texto que o LLM lê para decidir quando chamar a tool. Tem precedência
  // sobre o userStory do contrato; o gerador avisa quando não há nenhum dos
  // dois.
  description?: string;

  // Em getById/update/softDelete/hardDelete: de onde o LLM tira o id do
  // registro (ex.: "use o id retornado por consultar_reserva, nunca o CPF").
  // Sem ele, a tool só diz "Identificador único do registro alvo".
  idPrompt?: string;

  action: "create" | "get" | "getById" | "update" | "softDelete" | "hardDelete";

  intentMapping: {
    formFields: {
      fieldId: string;

      naturalLanguagePrompt: string;

      validationHint?: string;

      // Tipo JSON Schema explícito do parâmetro gerado. Tem precedência
      // sobre o mapeamento defensivo de EDataType feito pelo gerador, e
      // deixa a tipagem do parâmetro independente dos valores do enum.
      schemaType?: TAgentSchemaType;

      // Parâmetro obrigatório da tool. Em "create" o gerador já usa o
      // isRequired do form; aqui vale para qualquer action, inclusive "get".
      // A tool gerada recusa a chamada sem o parâmetro antes de chamar a API,
      // sem depender do LLM. Use em consultas de dados de clientes (pedido,
      // devolução) para que uma chamada sem filtro não liste registros de
      // terceiros.
      isRequired?: boolean;

      // Só em "get": como o filtro compara o texto. "partial" (padrão) busca
      // por trecho, sem diferenciar maiúsculas; "exact" exige o valor inteiro
      // (sem diferenciar maiúsculas em texto), para que um pedaço de e-mail
      // não encontre registros de outra pessoa. Campos id/*Id(s), enums e
      // tipos não textuais já comparam pelo valor exato.
      matchMode?: "exact" | "partial";
    }[];

    triggerKeywords: string[];
  };

  responseTemplate?: {
    successMessage: string;
    errorMessage: string;
  };
}

export interface IHumanHandoffContact {
  // Nome que o LLM usa para escolher o contato (ex.: "Júlia"). Único dentro
  // de humanHandoff.contacts.
  name: string;

  // Texto livre dizendo quando/por que este contato recebe a escalada (ex.:
  // "fecha reservas quando o hóspede confirma uma data disponível"). O LLM
  // compara o motivo da escalada com este texto para escolher o contato —
  // mesmo espírito de triggerKeywords, não uma lista fixa de categorias.
  useCase: string;

  // Telefone em E.164 (ex.: "+558296539080") que recebe a mensagem de
  // escalada no WhatsApp. Validado pelo schema.
  whatsappPhoneNumber: string;
}
