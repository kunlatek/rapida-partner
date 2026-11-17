# Plano de melhoria do skeleton `aiAgent` — 2026-11-16

Documento de análise para outro agente executar. Nenhum arquivo de `rapida-partner/src`, `rapida-code-generator`, `rapida-projects` ou do vault foi alterado para produzi-lo.

## Como ler

**Abreviações de caminho**

| Sigla | Caminho |
| --- | --- |
| `P/` | `rapida-partner/` |
| `G/` | `rapida-code-generator/` |
| `T/` | `rapida-code-generator/src/ai-agent/templates/` |
| `J/` | `rapida-projects/src/` |
| `V/` | vault `obsidian/KUNLATEK/SISTEMAS/` |

**Skills que executam** (todas em `agents-library/.agents/skills/`)

| Sigla | Skill | Repositório |
| --- | --- | --- |
| DSL | `rapida-partner-execution` | rapida-partner |
| MOTOR | `rapida-code-generator-ai-agent-execution` | rapida-code-generator (`src/ai-agent`) |
| FRONT/BACK | `rapida-code-generator-angular-nest-playwright-execution` | rapida-code-generator (resto) |
| PROJ | `rapida-projects-over-requirements` | rapida-projects |
| LIVE | `rapida-project-ai-agent-live-test` | validação por conversa real no WhatsApp |

**Estado dos repositórios na análise**

- `rapida-partner`: branch `feat/referral-commerce-skeleton` (3.4.0, PR kunlatek/rapida-partner#20 aberta). É onde nasce `IBackend.scheduledJobs`.
- `rapida-code-generator`: checkout local em `main`, 16 commits atrás de `origin/main`. `src/ai-agent` é idêntico entre o checkout local, `origin/main` e a branch da PR kunlatek/rapida-code-generator#66 (`git diff --stat` vazio). As linhas citadas de `src/ai-agent` valem para as três versões.
- `rapida-projects`: `main`, depende de `rapida-partner` 3.3.0.

**Como os achados foram verificados**

- Leitura do código citado em cada item.
- Geração real de `J/projects/aiAgent/katia/katia.ts` (montagem dentro de `infisical run`, tenant `kunlatek-dev`), leitura do agente em `generated/ai-agent/katia-agent`, `bun install` e `tsc --noEmit` no agente (passou sem erros).
- **Não** foi feita conversa real no WhatsApp. Onde um achado depende de comportamento em produção (janela de 24 h da Meta, destinatário do lembrete), isso está dito no item.

**Achados de revisões anteriores, não repetidos aqui**

- `fieldId` → `fieldName` em `intentMapping.formFields` (`P/docs/architecture-review-2026-08-14.md:39-44`).
- Vocabulário de `action` divergente entre contratos, listas e agente (`architecture-review-2026-08-14.md:93`).
- Falta de validação cruzada skeleton × campos opcionais (`architecture-review-2026-11-16.md:102-104`).
- Origem do `scheduledJobs` (`architecture-review-2026-11-16.md:128-145`). O item I-22 trata só da migração do `aiAgent` para ele.

Quando um lote mexer nas mesmas linhas, aplique também o rename `fieldId` → `fieldName` para não tocar duas vezes nos 6 projetos.

---

## 1. Intenção do skeleton

O `aiAgent` é a forma de entregar o produto **Kunlatalk**: uma atendente de IA com nome, persona e conhecimento da marca, que conversa com o cliente final pelo WhatsApp oficial (API da Meta), usa DeepSeek como motor e guarda histórico e cadastro em um backend sob titularidade do cliente (`V/KUNLATALK.md`, seções "Descrição" e "Diferenciais técnicos"). O vault descreve o Kunlatalk como "um whitelabel para Agentes de IA" (`V/RAPIDA CODE GENERATED/AGENTE DE IA/YARA.md`) e promete implantação "em dias".

Na prática, o que se vende é **backoffice + agente**. Os planos de produto falam de "produto `skeleton: "aiAgent"` com backoffice embutido" (`V/DOCUMENTATION/PO/AUTO CENTER BACKOFFICE - *.md`, linha 3 de cada). O agente lê e grava no mesmo backend que o backoffice administra: pessoas, agenda, catálogo, reservas.

Um projeto típico declara:

1. Persona e conhecimento: `agentIdentity` (prompt e base de conhecimento).
2. Canal e motor: `infrastructure` (em 5 de 6 projetos, `["whatsapp"]` + `deepseek`/`deepseek-chat`).
3. O que o agente pode fazer no backend: `exposedContracts`, mais as tools fixas de cadastro e agenda.
4. Os módulos do backoffice no mesmo `IProject` (`modules`), com `frontend` e `backend`.
5. Opcionais: `humanHandoff`, `audio`, `jobs.reminder`.

**Onde DSL e gerador se afastam dessa intenção**

| # | Afastamento | Evidência |
| --- | --- | --- |
| a | O skeleton nasceu de um agente de agendamento e ainda carrega isso como obrigatório. Agenda não é parte do produto para todo cliente: dois dos seis projetos não a usam e um teve de proibi-la no prompt. | `G/src/ai-agent/processors/tool-generator.processor.ts:34-50`; `J/projects/backoffice/kunlatalk/yaraBackoffice/yaraBackoffice.aiAgentConfig.ts:743-758`; `J/projects/backoffice/pierZero8/pierZero8Backoffice.aiAgentConfig.ts:144-147` |
| b | O vault diz "exclusivamente no WhatsApp". A DSL oferece Instagram (stub) e Telegram (sem campo de credencial). | `V/KUNLATALK.md` (Descrição); `P/src/interfaces/ai-agent.interface.ts:38-41`; `T/base/env/env-content.builder.ts:51-55` |
| c | "Backoffice embutido" não está modelado: o skeleton `aiAgent` cai no layout de backoffice por fallback (ou por `case` explícito na PR #66), mas perde a rota do painel. | `G/src/frontend/angular/ui/flowbite/templates/base/app-root.template.ts:39,121-127` |
| d | A promessa de "dias" esbarra em provisionamento manual: usuário do bot, chave do provedor, webhook. O gerador não avisa quando falta algum. | `P/src/interfaces/ai-agent.interface.ts:73-86`; `T/base/env/env-secrets.resolver.ts:41-60` |
| e | O backend separado (KR2 do plano de produto, "ERP nos moldes do Administrado") depende de `targetBackendDefinitionFile`, sem teste de ponta a ponta e sem URL do backend alvo. | `V/DOCUMENTATION/PM/KUNLATALK - Plano de Produto.md:55`; `T/base/env/env-content.builder.ts:12-17` |
| f | Vendas, pagamento e pós-venda (aniversário, pesquisa de satisfação) aparecem no vault como funções do produto. O skeleton só tem um job, de lembrete de agendamento. Fica registrado como lacuna de produto, fora deste plano. | `V/KUNLATALK.md` (Principais funcionalidades); `P/src/interfaces/ai-agent.interface.ts:116-130` |

**Sobre o `katia.ts` como "único setup testado de ponta a ponta"**: ele gera e compila, mas como está declarado não conversa. O `.env` gerado sai com `DEEPSEEK_API_KEY`, `BOT_API_EMAIL` e `BOT_API_PASSWORD` vazios, e o backend gerado não tem `/whatsapp-chat-histories`, então o agente não guarda histórico (I-01, I-08, I-30). Os agentes testados em conversa real, segundo o vault e os comentários dos projetos, são a Yara e a Karol.

---

## 2. Decisões que precisam de você

Cada decisão lista os itens que bloqueia. Itens sem decisão associada podem ser executados já.

### D1 — Tools fixas e endpoints implícitos: obrigatórios ou declarativos?

Hoje todo agente recebe 11 tools fixas e depende de 4 endpoints que o projeto não declara: `/people`, `/appointments`, `/availability-schedules` e `/whatsapp-chat-histories`.

| Opção | O que muda | Trade-off |
| --- | --- | --- |
| A. Manter sempre ligadas | Nada na DSL | Yara e Pier Zero 8 continuam com tools que não usam; o prompt padrão continua mandando checar disponibilidade em quem não tem agenda |
| B. Bloco opcional `capabilities` com tudo ligado por padrão **(recomendada)** | `aiAgentConfig.capabilities?: { identity?, scheduling?, knowledgeBase?, media? }`, cada um `true` se omitido | Aditiva. Nenhum projeto quebra. Quem não usa agenda desliga com uma linha |
| C. Tudo desligado por padrão (opt-in) | Mesmo bloco, padrão `false` | Mais limpo, mas quebra os 6 projetos e exige revisar cada prompt |

Recomendação: **B**. O histórico (`/whatsapp-chat-histories`) não entra em `capabilities`: é infraestrutura do agente e deve virar requisito validado na geração (I-01).

Bloqueia: I-15, I-33. Influencia I-04 (lembrete só faz sentido com `scheduling`).

**Decidido em 2026-11-17:** opção B (`capabilities` opcional, tudo ligado por padrão). Teste real na Yara (2026-11-17): sem agenda, ela respondeu certo só com tools dinâmicas (o prompt proíbe as de agenda), mas o job de lembrete rodava sem `/appointments` e dava 404 a cada 5 min.

### D2 — O que é um projeto `aiAgent`: skeleton próprio ou capacidade de um backoffice?

Fatos: a CLI só gera o agente quando `skeleton === "aiAgent"` (`G/cli.ts:172`); a Yara ficou meses com `skeleton: "backoffice"` e `aiAgentConfig` preenchido sem gerar agente e sem aviso (`V/RAPIDA/RAPIDA CODE GENERATOR.md:68`); dois projetos `aiAgent` moram em `J/projects/backoffice/`; a PR #66 transforma `aiAgent` em `case` de backoffice.

| Opção | O que muda | Trade-off |
| --- | --- | --- |
| A. `aiAgent` continua skeleton próprio, definido como "backoffice + agente" | Corrigir a rota raiz (I-27) e documentar | Simples. Um ecommerce ou marketplace nunca poderá ter agente |
| B. Agente vira capacidade: gera quando `aiAgentConfig` existe, em qualquer skeleton; `skeleton: "aiAgent"` segue aceito como sinônimo de backoffice **(recomendada)** | `cli.ts` passa a testar `project.aiAgentConfig`; front trata `aiAgent` igual a `backoffice` | Aditiva enquanto o sinônimo existir. Elimina o gotcha da Yara. Abre caminho para loja com atendente |
| C. `aiAgent` gera só o agente; backoffice vira outro projeto | Separar os 6 projetos em dois arquivos cada | Coerente com o nome, mas depende de D3 e dobra o número de projetos |

Recomendação: **B**, mantendo o sinônimo. Remover o valor `"aiAgent"` do union fica para uma versão major futura, se você quiser.

Bloqueia: I-28, I-32. I-27 pode ser feito antes (é correção nas duas opções A e B).

**Decidido em 2026-11-17:** opção B (agente gerado quando há `aiAgentConfig`, em qualquer skeleton; `"aiAgent"` segue aceito como sinônimo de backoffice).

### D3 — Backend em outro projeto (`targetBackendDefinitionFile` / `targetBackendProjectId`)

Fatos: nenhum dos 6 projetos usa `targetBackendDefinitionFile`. `targetBackendProjectId` é obrigatório no schema e o gerador nunca o lê (só aparece em fixtures de teste). Com backend externo, `BOT_API_BASE_URL` sairia do `backend[]` do próprio projeto do agente, que não é o alvo.

| Opção | O que muda | Trade-off |
| --- | --- | --- |
| A. Remover os dois campos; só backend embutido | Schema e loader encolhem | Mata o KR2 por este caminho |
| B. Tornar o backend externo de primeira classe **(recomendada)** | Substituir os dois campos por `targetBackend?: { definitionFile: string; baseUrl: string }`; teste unitário com fixture e um teste de ponta a ponta | Breaking com migração mecânica (remover `targetBackendProjectId` dos 6 projetos). Exige um projeto piloto para o teste real |
| C. Deixar como está e só documentar | Nada | O campo obrigatório sem uso continua confundindo (o Pier Zero 8 preenche `"example"`) |

Recomendação: **B**, mas só quando houver cliente para o KR2. Até lá, executar a parte barata: tornar `targetBackendProjectId` opcional e avisar que não é usado (aditiva).

Bloqueia: I-17.

**Decidido em 2026-11-17:** opção B (`targetBackend: { definitionFile, baseUrl }`). O teste real fica para quando houver projeto piloto.

### D4 — Provisionamento do usuário do bot

Fatos: `botCredentials` é opcional; só Karol e Pier Zero 8 declaram. O usuário precisa existir no backend alvo e é criado à mão. O `secret.ts` do rapida-projects registra que `BOT_API_*` do `pier-zero-8` ainda nem foi provisionado.

| Opção | O que muda | Trade-off |
| --- | --- | --- |
| A. Manter manual, com checklist gerado no README do agente | Só documentação e aviso na geração | Continua sendo o passo que mais atrasa a implantação |
| B. Backend gerado cria o usuário de serviço no bootstrap quando o projeto tem `aiAgentConfig` **(recomendada)** | Seed idempotente no Nest, com papel restrito às entidades das tools; `botCredentials` passa a ser obrigatório | Breaking com decisão manual: 4 projetos precisam de segredo novo no Infisical. Mantém login por senha |
| C. Trocar senha por chamador confiável (`IBackend.trustedCallers`, RFC 7523, já usado pela loja) | Agente assina token de serviço; some `botCredentials` | Mais seguro e sem senha, mas é a maior mudança: novo fluxo de autenticação no agente e no backend |

Recomendação: **B** agora; **C** como evolução quando o backend externo (D3) entrar, porque é o mesmo problema da loja falando com o vendedor.

Bloqueia: I-25, I-31 (parte de `botCredentials`).

**Decidido em 2026-11-17:** opção B (backend gerado cria o usuário de serviço no bootstrap; `botCredentials` obrigatório). A opção C fica como evolução quando o backend externo (D3) entrar.

### D5 — Lembrete: onde fica a frequência, quem recebe e como envia

Três perguntas ligadas ao mesmo job.

**5a. Frequência: `jobs.reminder.cronInterval` ou `IBackend.scheduledJobs`?**

| Opção | Trade-off |
| --- | --- |
| A. Manter em `aiAgentConfig.jobs` | Dois lugares na DSL para cron, que foi o motivo de criar `scheduledJobs` |
| B. Mover `cronInterval` e `timezone` para `IBackend.scheduledJobs` com id `"aiAgentAppointmentReminder"`; `enabled` e `minutesAhead` ficam em `aiAgentConfig` **(recomendada)** | Breaking com migração mecânica nos 6 projetos. Ganha variação por ambiente. O comentário de `IScheduledJob` precisa dizer que este id roda no agente, não no Nest |
| C. Aceitar os dois, `scheduledJobs` vence | Aditiva, mas perpetua a duplicidade |

**5b. Quem recebe o lembrete?** O código envia para `involvedPeopleId[0]`, e `criar_evento` grava ali o profissional escolhido, não o cliente (`T/jobs/reminder-sender.template.ts:45`; `T/tools/appointment/create-event.tool.template.ts:108`). Leitura do código, não confirmada em conversa real. Opções: só o cliente (recomendada, é o que o plano de produto descreve como fidelização), só o profissional, ou os dois.

**5c. Como enviar fora da janela de 24 h?** O envio é texto livre (`reminder-sender.template.ts:76`). A Meta só aceita texto livre até 24 h depois da última mensagem do cliente; fora disso exige modelo de mensagem aprovado. Com `minutesAhead: 1440`, o lembrete quase sempre cai fora da janela. Opções: declarar o nome do modelo aprovado na DSL (recomendada), ou limitar `minutesAhead` e aceitar a perda. Regra da plataforma, a confirmar no LIVE.

Bloqueia: I-04, I-22.

**Decidido em 2026-11-17:** 5a opção B (`cronInterval`/`timezone` em `IBackend.scheduledJobs`, id `"aiAgentAppointmentReminder"`); 5b cliente **e** profissional, configurável por projeto (padrão os dois); 5c modelo de mensagem aprovado na Meta por destinatário, declarado na DSL. Teste real na Karol (2026-11-17): o job achou o agendamento 27 h antes (fuso em UTC) e tentou avisar só o profissional (`involvedPeopleId[0]`), que não tinha telefone, então nada foi enviado. Na Yara, o job roda sem `/appointments` e dá 404 a cada 5 min.

### D6 — Mensageiros: o que a DSL deve oferecer

| Opção | Trade-off |
| --- | --- |
| A. Só WhatsApp; remover `"instagram"` e `"telegram"` do union | Coerente com o vault. Joga fora o adaptador de Telegram já escrito |
| B. Remover `"instagram"` (stub); manter `"telegram"` e dar a ele um campo de credencial **(recomendada)** | Breaking com migração mecânica só no `katia.ts`. Telegram fica marcado como não testado em conversa real |
| C. Implementar Instagram | Sem cliente pedindo; maior esforço do plano |

Bloqueia: I-21.

**Decidido em 2026-11-17:** opção B (remover `"instagram"`; Telegram com campo de credencial, marcado como não testado em conversa real).

### D7 — Idioma do agente em runtime

Nomes de tools, mensagens de erro ao cliente, fuso e DDI são fixos em pt-BR/Brasil, com duas mensagens em inglês no meio (I-14).

| Opção | Trade-off |
| --- | --- |
| A. Fixar pt-BR/Brasil e corrigir só o que está em inglês **(recomendada)** | Aditiva e pequena. Agente para cliente fora do Brasil não é suportado, e isso fica escrito na DSL |
| B. Derivar de `IProject.defaultLanguage` e de um novo `aiAgentConfig.locale` (fuso, DDI) | Correto a longo prazo; exige traduzir prompt padrão e textos das tools |

Em qualquer opção, **não renomear as tools fixas**: os 4 prompts literais citam os nomes em pt-BR e quebrariam em silêncio.

Bloqueia: parte de I-14 (fuso e DDI configuráveis).

---

## 3. Itens de melhoria

Risco de quebra: **aditiva**, **breaking mecânica** (migração por busca e troca) ou **breaking manual** (exige decisão ou trabalho por projeto). Os seis projetos são: `katia`, `autoCenterBackoffice`, `kunlatalkBackoffice` (Karol), `ficharapidaComercial` (Kécia), `yaraBackoffice`, `pierZero8Backoffice` (id `example`).

### 3.1 Motor do agente: correção

#### I-01 — Histórico depende de `/whatsapp-chat-histories`, que ninguém declara nem valida

- **Realidade**: `HistoryService` lê e grava em `/whatsapp-chat-histories` e engole qualquer erro. O gerador só avisa sobre três endpoints fixos; este não está na lista. No `katia`, o backend gerado não tem esse controller: o agente roda sem memória de conversa e sem registro, e só um erro de log denuncia.
- **Expectativa**: o endpoint entra na verificação de geração. Sem ele, a geração falha com mensagem que diz qual módulo incluir. A interface da DSL documenta o requisito.
- **Evidência**: `T/services/history.service.template.ts:30,48` (endpoint), `:38,61` (catch que só loga); `G/src/ai-agent/processors/tool-generator.processor.ts:34-50,63-71`; `J/projects/aiAgent/katia/katia.ts:192-198` (sem módulo de WhatsApp). Na geração real, `generated/backend/katia-api/src/modules/` não tinha `whatsapp-chat-histories`. A DSL cita só três endpoints: `P/src/interfaces/ai-agent.interface.ts:60-63`.
- **Skill**: MOTOR (validação), DSL (comentário), PROJ (`katia`, em I-30).
- **Risco**: breaking mecânica para quem não tem o módulo. Afeta `katia`. Os outros cinco já incluem `whatsappModule` ou o módulo `whatsapp` com `whatsappChatHistoryForm`.
- **Validar**: teste unitário em `tool-generator.processor` (projeto sem o endpoint → erro). LIVE: segunda mensagem da conversa mostra que o agente lembra da primeira.
- **Dependências**: nenhuma. Fazer junto com I-30.

#### I-02 — Identidade do cliente se perde; `IdentityService` é código morto

- **Realidade**: `session.userId` só é preenchido quando o LLM chama `cadastrar_usuario`. A sessão vive em memória, com TTL de 30 minutos, e some a cada reinício. Cliente que volta no dia seguinte é desconhecido até se "recadastrar", e `criar_evento` e `meus_agendamentos` respondem "Usuário não identificado". O `IdentityService` gerado, que resolveria a pessoa pelo `lid`, não é importado em lugar nenhum. Ele ainda calcula o `lid` de forma diferente da tool de cadastro.
- **Expectativa**: no início de `processMessage`, o agente resolve a pessoa pelo `lid` e preenche a sessão. Uma única função calcula o `lid`. O `IdentityService` passa a ser usado ou é removido.
- **Evidência**: `T/services/session.service.template.ts:9-14`; `T/services/identity.service.template.ts:65,98` (`split("@")[0]`) contra `T/tools/identity/register-user.tool.template.ts:71` (`lid: remoteJid`); `T/services/index.ts:11,27` gera o serviço; no agente gerado, `grep IdentityService` só encontra o próprio arquivo; `T/tools/appointment/create-event.tool.template.ts:52`.
- **Skill**: MOTOR.
- **Risco**: aditiva. Muda comportamento em runtime para melhor em todos os agentes.
- **Validar**: teste unitário do template de `conversation.service` (chama a resolução antes do LLM). LIVE: cadastrar, reiniciar o agente no Coolify, pedir "meus agendamentos" sem se apresentar de novo.
- **Dependências**: depois de I-01 (mesmos arquivos de serviço).

#### I-03 — Loop de conversa: limite fixo, atalho só para `criar_evento`, mensagens concorrentes

- **Realidade**: `maxIterations = 5` fixo. O único atalho de saída é o nome literal `criar_evento`, e o `break` dentro do `for` abandona as outras tool calls do mesmo turno sem resposta `tool`. Não há fila por usuário: duas mensagens seguidas do mesmo número rodam em paralelo sobre o mesmo histórico. O webhook não descarta `message.id` repetido, e a Meta reenvia.
- **Expectativa**: limite configurável (constante nomeada no mínimo), atalho removido ou generalizado, toda tool call respondida, uma mensagem por usuário de cada vez, descarte de `message.id` já visto.
- **Evidência**: `T/services/conversation.service.template.ts:38,50,54,75`; caso real e diagnóstico em `V/RAPIDA/RAPIDA CODE GENERATOR.md:70`; `T/messengers/whatsapp.messenger.template.ts:77` (responde 200 e processa depois, sem deduplicar); `T/index/messenger-bootstrap.template.ts:55-101` (handler sem fila).
- **Skill**: MOTOR.
- **Risco**: aditiva.
- **Validar**: teste unitário da lógica do loop extraída para função pura (várias tool calls no mesmo turno; estouro do limite). LIVE: enviar três mensagens em sequência rápida e conferir uma resposta coerente.
- **Dependências**: nenhuma.

#### I-04 — Lembrete: fuso, destinatário e janela da Meta

- **Realidade**: (1) a hora-alvo é calculada com `toISOString()`, ou seja UTC, e comparada com `appointmentTime`, gravado como o cliente falou, em hora local. Em São Paulo o disparo sai 3 horas adiantado. O `timezone` da DSL só é usado pelo agendador do cron. (2) A busca é por igualdade de minuto: se o processo estiver fora do ar naquele minuto, o lembrete se perde, e não há marca de "já lembrado". (3) O destinatário é `involvedPeopleId[0]`, o profissional. (4) O envio é texto livre.
- **Expectativa**: hora-alvo no fuso configurado; busca por janela de tempo com marca de enviado; destinatário e forma de envio conforme D5.
- **Evidência**: `T/jobs/reminder-sender.template.ts:24-25` (UTC), `:31-32` (igualdade), `:45` (destinatário), `:76` (texto livre); `T/tools/appointment/create-event.tool.template.ts:108`; `T/config/rules.template.json.ts:22-27`. Correção parcial anterior registrada em `V/RAPIDA/RAPIDA CODE GENERATOR.md:72`.
- **Skill**: MOTOR; DSL se D5c exigir campo novo (nome do modelo de mensagem).
- **Risco**: **breaking manual**. Muda quem recebe e exige modelo aprovado por conta do WhatsApp Business. Afeta os 5 projetos com lembrete ligado (todos menos `pierZero8Backoffice`).
- **Validar**: teste unitário do cálculo de data e hora com fuso (função pura). LIVE: agendar para dali a `minutesAhead` + alguns minutos e conferir quem recebe e quando.
- **Dependências**: **bloqueado por D5**. Depois de I-15 e I-22.

#### I-05 — Porta: `.env` diz 3000, Docker espera 80

- **Realidade**: o `.env` gerado traz `PORT=3000`. O `docker-compose.yml` carrega esse `.env`, publica `80:80` e faz healthcheck em `localhost:80`. Com o `.env` gerado, o container sobe na 3000 e o healthcheck falha. Em desenvolvimento, 3000 é também a porta do backend do mesmo projeto (`BOT_API_BASE_URL=http://localhost:3000`).
- **Expectativa**: uma porta só, coerente entre `.env`, `Dockerfile`, compose e healthcheck, e diferente da do backend em desenvolvimento.
- **Evidência**: `T/base/env/env-content.builder.ts:39`; `T/index.template.ts:164` (padrão 80); `T/base/dockerfile.template.ts:24`; `T/base/docker-compose.template.ts:16,24`; `J/projects/aiAgent/katia/katia.ts:48`.
- **Skill**: MOTOR.
- **Risco**: aditiva. Conferir com LIVE como o Coolify define a porta hoje antes de mudar o padrão.
- **Validar**: teste em `env-content.builder.test.ts` (porta do `.env` igual à do compose). Local: `docker compose up` e healthcheck verde.
- **Dependências**: nenhuma.

#### I-09 — `ApiService`: 403 tratado como token expirado, sem timeout

- **Realidade**: 401 e 403 disparam novo login e nova tentativa. Um 403 de permissão (papel do bot sem acesso à entidade) vira login repetido a cada chamada, com log "Token expired". As chamadas não têm timeout. Credenciais vazias só falham na primeira mensagem do cliente.
- **Expectativa**: só 401 reautentica; 403 volta para a tool como erro de permissão legível; timeout nas chamadas; no bootstrap, login de verificação que falha cedo e com mensagem clara.
- **Evidência**: `T/services/api.service.template.ts:41,60` (cliente sem timeout), `:102` (401 ou 403).
- **Skill**: MOTOR.
- **Risco**: aditiva.
- **Validar**: teste unitário do template (string gerada não reautentica em 403). LIVE: bot com papel sem permissão em uma entidade, conferir a resposta e o log.
- **Dependências**: nenhuma.

### 3.2 Motor do agente: segurança e dados pessoais

#### I-06 — Webhook do WhatsApp sem verificação de assinatura; token de verificação no log

- **Realidade**: `POST /webhook/whatsapp` aceita qualquer corpo. Quem conhece a URL consegue injetar mensagens em nome de qualquer número. `whatsappAppSecret` existe na DSL e o backend Nest gerado valida a assinatura, mas o agente ignora o campo. O `GET` de verificação grava no log o token recebido.
- **Expectativa**: o agente valida `X-Hub-Signature-256` quando `whatsappAppSecret` está declarado e avisa na geração quando não está. O token não vai para o log.
- **Evidência**: `T/messengers/whatsapp.messenger.template.ts:53-55,77`; `P/src/interfaces/project-backend.interface.ts:41-47`; `T/base/env/env-secrets.resolver.ts:3-11` (sem app secret); o backend tem `G/src/backend/nest/mongodb/templates/flows/whatsapp/whatsapp-webhooks-signature.template.ts`. Só o Pier Zero 8 preenche o campo, e com o valor de `JWT_SECRET` (`J/projects/backoffice/pierZero8/pierZero8Backoffice.ts:104,146`), que não é o App Secret da Meta.
- **Skill**: MOTOR; PROJ para corrigir o Pier Zero 8 e declarar o segredo nos demais.
- **Risco**: aditiva enquanto a validação for condicional ao campo. Atenção: ligar a validação no Pier Zero 8 com o valor atual derruba o webhook.
- **Validar**: teste unitário de uma função pura de verificação de assinatura (corpo + segredo → válido ou inválido). LIVE: mensagem real continua chegando; `curl` sem assinatura recebe 401/403.
- **Dependências**: precisa do corpo bruto da requisição, então mexe no `express.json()` de `T/index.template.ts`.

#### I-07 — Tools sem escopo: exclusão física, id livre e filtro Mongo cru

- **Realidade**:
  - `cancelar_agendamento` faz exclusão física de qualquer `appointmentId` que o LLM informar, sem conferir se é do cliente da conversa.
  - `atualizar_status_usuario` recebe `personId` do LLM, não da sessão.
  - Tools dinâmicas de `get` enviam `JSON.stringify(args)` como `filters`. O backend gerado interpreta `filters` como consulta MongoDB. Não há lista de chaves permitidas nem bloqueio de operadores, então o LLM (ou uma mensagem maliciosa) pode filtrar por qualquer campo. O filtro é igualdade exata: buscar produto por nome só funciona com o nome idêntico.
  - Tools dinâmicas de `update`, `softDelete` e `hardDelete` aceitam qualquer `id`.
- **Expectativa**: tools fixas operam só sobre a pessoa da sessão. Cancelamento confere o dono e usa exclusão lógica. Tools dinâmicas aceitam só as chaves declaradas em `formFields`, rejeitam valores que não sejam do tipo declarado e usam busca por trecho em campos de texto.
- **Evidência**: `T/tools/appointment/manage-appointments.tool.template.ts:48-49,64`; `T/tools/identity/update-user.tools.template.ts:17-28`; `T/tools/dynamic.tool.template.ts:34-40` (get), `:46-64` (update e exclusões). No backend gerado do `katia`, `products.controller.ts` descreve `filters` como "MongoDB query as JSON string" e repassa o objeto ao serviço. Os próprios projetos evitam expor escrita por esse risco: `yaraBackoffice.aiAgentConfig.ts:1000-1007`, `pierZero8Backoffice.aiAgentConfig.ts:133-137`, `autoCenterBackoffice.aiAgentConfig.ts:111-114`.
- **Skill**: MOTOR. O tratamento de `filters` no backend é da FRONT/BACK e fica fora deste plano.
- **Risco**: aditiva na DSL. Muda comportamento: cancelamento deixa de apagar o registro; `consultar_produtos` passa a achar por trecho. Afeta todos.
- **Validar**: testes unitários em `tool-schema.builder` e no template dinâmico (chave fora do schema é descartada; valor objeto é rejeitado). LIVE: pedir para cancelar um agendamento de outro cliente pelo id.
- **Dependências**: depois de I-02 (precisa da pessoa na sessão).

#### I-10 — Logs: conteúdo das conversas e telefones em texto claro; dois estilos de log

- **Realidade**: o agente grava no log o telefone e o texto de cada mensagem, a transcrição de áudio, os argumentos de cada tool e o payload de criação de agendamento. Há 30 chamadas a `console.*` nas tools ao lado de 154 ao `logger`. O `logger` não tem nível configurável; `debug` depende de `NODE_ENV`.
- **Expectativa**: um logger só, com nível por variável de ambiente. Conteúdo de mensagem e telefone só em `debug`, e telefone mascarado nos demais níveis.
- **Evidência**: `T/index/messenger-bootstrap.template.ts:55`; `T/messengers/whatsapp/whatsapp-webhook-processor.template.ts:98`; `T/messengers/whatsapp/whatsapp-audio-processor.template.ts:123`; `T/tools/appointment/create-event.tool.template.ts:52,59,95`; `T/tools/identity/register-user.tool.template.ts:37,42,65`; `T/base/utils/logger.template.ts`. Um dos projetos trata dado de saúde como restrição explícita (`J/projects/aiAgent/fichaRapida/ficharapidaComercial/ficharapidaComercial.aiAgentConfig.ts:477-482`).
- **Skill**: MOTOR.
- **Risco**: aditiva. A skill LIVE lê linhas `[TOOL] Executing ...` nos logs do Coolify; manter esse formato (sem os argumentos completos em `info`) ou atualizar a skill no mesmo lote.
- **Validar**: teste unitário que falha se algum template de `src/ai-agent/templates` contiver `console.` fora do logger. LIVE: conferir que a skill ainda encontra as linhas de tool.
- **Dependências**: nenhuma.

### 3.3 Motor do agente: configuração, qualidade e empacotamento

#### I-08 — Geração passa em silêncio com segredos vazios; chaves de provedor sem caminho na DSL

- **Realidade**: a geração do `katia` terminou sem nenhum aviso com `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `BOT_API_EMAIL`, `BOT_API_PASSWORD` e `TELEGRAM_BOT_TOKEN` vazios. A chave do DeepSeek só é aceita com `service: "chat"`; três projetos declaram apenas `"cost"`. `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN` e `INSTAGRAM_*` são sempre gravados vazios: a DSL não tem campo para eles. `model` é string livre, sem conferência contra o provedor, e os modelos padrão aparecem duplicados em dois templates.
- **Expectativa**: a geração falha (ou avisa em destaque) quando o provedor ativo não tem chave, quando um mensageiro ativo não tem credencial e quando falta `botCredentials`. A DSL ganha `geminiIntegration`. `model` ganha lista de valores conhecidos por provedor no comentário, com aviso para valor desconhecido.
- **Evidência**: `T/base/env/env-secrets.resolver.ts:27-39,46-48`; teste que fixa a regra do `"chat"`: `T/base/env/env-secrets.resolver.test.ts:86`; `T/base/env/env-content.builder.ts:51-55,67`, `:26-31` e `T/base/config/env.template.ts:12-17` (padrões duplicados); `P/src/interfaces/project.interface.ts:63-72` (sem Gemini); `P/src/interfaces/ai-agent.interface.ts:42-43`. Só `"cost"`: `J/projects/aiAgent/kunlatalk/autoCenterBackoffice/autoCenterBackoffice.ts:303-308`, `J/projects/backoffice/kunlatalk/yaraBackoffice/yaraBackoffice.ts:225-230`, `J/projects/backoffice/pierZero8/pierZero8Backoffice.ts:167-170`. Nenhuma integração: `katia.ts`.
- **Skill**: MOTOR (validação), DSL (`geminiIntegration`, comentário de `model`), PROJ (I-31).
- **Risco**: como aviso, aditiva. Como erro, breaking mecânica para `katia`, `autoCenterBackoffice`, `yaraBackoffice` e `pierZero8Backoffice`. Sugestão: aviso primeiro, erro depois de I-31.
- **Validar**: testes em `env-secrets.resolver.test.ts` (provedor sem chave → diagnóstico). Geração do `katia` mostra os avisos.
- **Dependências**: I-31 antes de virar erro. Telegram depende de D6.

#### I-11 — Configuração morta, duplicada ou não documentada

- **Realidade**:
  - `KNOWLEDGE_FILE` e `SYSTEM_PROMPT_FILE` saem fixos no `.env`, sem relação com `knowledgeBaseFile`. A tool de conhecimento usa um caminho fixado na geração, então mudar `KNOWLEDGE_FILE` não faz nada. No Auto Center o `.env` aponta para `data/knowledge.md` e a tool lê `data/auto-center-knowledge.md`.
  - O `.env` lista variáveis de provedores e mensageiros cujo código não foi gerado.
  - `TYPING_INDICATOR_DELAY_MS` e `SPLIT_MESSAGE_DELAY_MS` são lidas direto de `process.env`, fora de `env.ts` e do `.env.example`.
  - O lembrete tem três fontes de padrão: valores gravados em `ReminderService`, `config/rules.json` e a DSL.
  - `META_GRAPH_API_VERSION=v21.0`, enquanto o runbook validado usa `v25.0`.
  - Limites de mensagens por minuto e TTL de sessão são constantes sem configuração.
- **Expectativa**: cada variável do `.env` é lida pelo código gerado. O `.env` só lista o que o agente usa. Um lugar só para cada padrão.
- **Evidência**: `T/base/env/env-content.builder.ts:58-59,85-86`; `T/base/config/env.template.ts:60-62`; `T/tools/knowledge.tool.template.ts:9-10,20`; `autoCenterBackoffice.aiAgentConfig.ts:9`; `T/index/messenger-bootstrap.template.ts:61`; `T/index.template.ts:22-48`; `T/config/rules.template.json.ts:22-27`; `T/services/rate-limit.service.template.ts:32-43`; `T/services/session.service.template.ts:10`; `V/RAPIDA CODE GENERATED/AGENTE DE IA/RUNBOOK - CRIAR APP META E CONECTAR AO WHATSAPP.md:81`.
- **Skill**: MOTOR.
- **Risco**: aditiva. Remover variáveis do `.env` pode exigir limpeza nas variáveis do Coolify dos agentes implantados (Yara, Karol, Auto Center).
- **Validar**: teste unitário que cruza as chaves de `buildAgentEnvContent` com as lidas em `env.template.ts`. Geração do `katia` e leitura do `.env`.
- **Dependências**: depois de I-08 (mesmos arquivos).

#### I-12 — `consultar_base_conhecimento` ignora a pergunta e devolve o arquivo inteiro

- **Realidade**: a tool exige o parâmetro `query` e não o usa. Devolve o arquivo completo a cada chamada. A base da Yara tem cerca de 230 linhas; cada consulta recoloca tudo no contexto.
- **Expectativa**: escolher uma das duas formas honestas. Ou a tool busca por seção (títulos `##`) e devolve só as relevantes, ou o parâmetro some e a descrição diz que a tool devolve a base inteira. Para bases pequenas, considerar injetar a base no prompt e não gerar a tool.
- **Evidência**: `T/tools/knowledge.tool.template.ts:29-37` (parâmetro), `:41-52` (execução); `yaraBackoffice.aiAgentConfig.ts:497-730`.
- **Skill**: MOTOR.
- **Risco**: aditiva. Muda o que o LLM recebe; revalidar persona.
- **Validar**: teste unitário da função de busca por seção. LIVE: pergunta de base de conhecimento na Yara e na Karol.
- **Dependências**: nenhuma.

#### I-13 — Empacotamento: sem README, sem testes, build não reproduzível

- **Realidade**: o agente gerado não tem README. O runbook do vault é a única instrução, fora do repositório do agente. Não há nenhum teste. O `Dockerfile` copia só `package.json` e roda `bun install` sem lockfile. O script `build` é `tsc`, que emite um `dist/` que nada usa. `openai`, `@google/generative-ai` e `fluent-ffmpeg` são dependências fixas mesmo quando o provedor é DeepSeek e não há áudio. O compose monta `data`, `config` e `prompts` como volumes, o que sugere edição em runtime que a próxima geração sobrescreve.
- **Expectativa**: README gerado com variáveis obrigatórias, URL do webhook, checklist de provisionamento e como rodar. Dependências conforme provedor e áudio. `build` vira checagem de tipos. Um teste mínimo de fumaça.
- **Evidência**: `G/src/ai-agent/scaffolder.ts:50-71` (lista de arquivos, sem README); `T/base/dockerfile.template.ts:16-17`; `T/base/package.template.ts:15-35`; `T/base/docker-compose.template.ts:19-22`; `T/base/tsconfig.template.ts` (`outDir`).
- **Skill**: MOTOR.
- **Risco**: aditiva.
- **Validar**: teste unitário do `package.template` por combinação de provedor. Gate da skill MOTOR (`bun install && bun run build` no agente gerado).
- **Dependências**: depois de I-08 e I-11 (o README lista as variáveis finais).

#### I-14 — Textos ao cliente em inglês, DDI e fuso fixos

- **Realidade**: o aviso de excesso de mensagens e o erro interno saem em inglês para um cliente brasileiro. O telefone recebe `+55` quando não começa com 55. O fuso do prompt é fixo em `America/Sao_Paulo`, sem relação com `jobs.reminder.timezone`. O prompt de reserva em `app.config` é outro texto fixo, usado quando o arquivo de prompt não existe.
- **Expectativa**: textos em pt-BR. Fuso e DDI em um lugar só, conforme D7.
- **Evidência**: `T/index/messenger-bootstrap.template.ts:76,101`; `T/tools/identity/identity-helpers.template.ts:38`; `T/services/conversation/system-prompt-builder.template.ts:27`; `T/base/config/app-config.template.ts:107-118`.
- **Skill**: MOTOR; DSL se D7 escolher a opção B.
- **Risco**: aditiva.
- **Validar**: teste unitário que procura as duas frases em inglês nos templates. LIVE: provocar o limite de mensagens.
- **Dependências**: trocar os textos não depende de nada. Fuso e DDI configuráveis estão **bloqueados por D7**.

### 3.4 DSL e resolução de contracts

#### I-15 — Tools fixas declarativas e prompt padrão coerente com elas

- **Realidade**: as 11 tools fixas são sempre geradas e registradas. O prompt padrão traz uma "Regra de OURO sobre disponibilidade" e a tabela completa de tools de agenda para qualquer projeto. O Pier Zero 8 usa o prompt padrão e não tem agenda. A Yara precisou de uma proibição explícita no prompt depois que um teste real mostrou o LLM chamando `checar_disponibilidade` sobre uma coleção vazia e recusando qualquer data.
- **Expectativa**: bloco `capabilities` (D1). Tool desligada não é gerada, não é registrada, não aparece no prompt padrão e não entra na verificação de endpoints. O job de lembrete só é gerado com `scheduling` ligado.
- **Evidência**: `T/tools/index.template.ts:54-68`; `G/src/ai-agent/processors/tool-generator.processor.ts:73-82`; `T/prompts/prompt-sections.ts:30-42,56-66,104-112`; `pierZero8Backoffice.aiAgentConfig.ts:9,144-147`; `yaraBackoffice.aiAgentConfig.ts:743-758,816-830`; `yaraBackoffice.ts:242-247`; `T/jobs/reminder.job.template.ts:8-12`.
- **Skill**: DSL (interface e schema), MOTOR (geração condicional), PROJ (I-33).
- **Risco**: aditiva na opção B de D1. Na opção C seria breaking manual nos 6.
- **Validar**: testes unitários em `tool-generator.processor` e `prompt-sections` por combinação de `capabilities`. Geração do `katia` sem diferença no resultado. LIVE na Yara depois de I-33.
- **Dependências**: **bloqueado por D1**.

#### I-16 — Colisão de nome com tool fixa não é detectada; lista da DSL está incompleta

- **Realidade**: o comentário da DSL lista 10 tools fixas e pede para não redeclará-las. Faltam `mostrar_imagem` e `escalar_para_humano`. O gerador não confere colisão: um binding com nome de tool fixa gera duas tools com o mesmo nome, e a segunda substitui a primeira no `Map` do executor. Os 6 projetos repetem o aviso em comentário, sinal de que a regra é fácil de errar.
- **Expectativa**: a geração falha com mensagem clara em colisão de `toolName` (com tool fixa ou entre bindings). A lista de nomes fixos vive em uma constante só, usada pelo gerador e citada pela DSL.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:60-68`; `T/tools/index.template.ts:56-67`; `T/tools/media/show-image.tool.template.ts:11`; `T/tools/escalation/escalate-to-human.tool.template.ts:14`; `T/services/tool-executor.service.template.ts` (registro por nome); comentários repetidos em `katia.ts:148-153`, `autoCenterBackoffice.aiAgentConfig.ts:24-28`, `kunlatalkBackoffice.aiAgentConfig.ts:449-453`.
- **Skill**: MOTOR, DSL (comentário).
- **Risco**: aditiva. Nenhum projeto colide hoje.
- **Validar**: teste unitário em `tool-generator.processor` (binding `criar_evento` → erro).
- **Dependências**: junto com I-15 (a lista de fixas passa a depender de `capabilities`).

#### I-17 — `targetBackendProjectId` sem uso; `targetBackendDefinitionFile` incompleto e sem teste

- **Realidade**: `targetBackendProjectId` é obrigatório e nunca é lido. `targetBackendDefinitionFile` não é usado por nenhum projeto. O loader não tem teste e, em caso de erro, só avisa e segue. Com backend externo não existe de onde tirar a URL: `BOT_API_BASE_URL` vem do `backend[]` do próprio projeto. Os endpoints fixos também teriam de existir no alvo.
- **Expectativa**: conforme D3. No mínimo: `targetBackendProjectId` opcional e marcado como não usado; teste unitário do loader com fixture; falha (não aviso) quando o arquivo declarado não carrega.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:47,49-58`; `P/src/schemas/ai-agent-config.ref.json:162`; `G/src/ai-agent/target-backend.loader.ts:21-57`; `G/src/ai-agent/index.ts:57-59`; `T/base/env/env-content.builder.ts:12-17`; uso do campo só em fixtures: `T/base/env/env-content.builder.test.ts:28`; `pierZero8Backoffice.aiAgentConfig.ts:21`; `V/DOCUMENTATION/PM/KUNLATALK - Plano de Produto.md:55`.
- **Skill**: DSL, MOTOR, PROJ.
- **Risco**: parte mínima, aditiva. Opção B de D3, breaking mecânica nos 6 (remover uma linha). Opção A, breaking mecânica.
- **Validar**: teste unitário do loader (JSON válido, arquivo ausente, `.ts`). Para a opção B: LIVE com um agente apontando para um backoffice separado.
- **Dependências**: **bloqueado por D3** (menos a parte mínima).

#### I-18 — `id` injetado sem orientação; campos obrigatórios do backend sem conferência

- **Realidade**: para `getById`, `update`, `softDelete` e `hardDelete`, o gerador injeta `id` com a descrição genérica "Identificador único do registro alvo". O LLM não sabe de onde tirar esse valor. Caso real na Yara: passou o CPF onde era o id interno, o backend devolveu 500 e ela disse ao hóspede que não havia reserva. `required` só é preenchido em `create`. Não há conferência entre os campos obrigatórios do formulário e os `formFields` do binding: esquecer um faz toda chamada falhar na validação do backend (caso real `criar_cotacao`).
- **Expectativa**: o binding ganha um campo opcional para descrever a origem do id (por exemplo `idPrompt`). Para `create`, o gerador avisa quando um campo obrigatório e não condicional do formulário não está em `formFields`.
- **Evidência**: `G/src/ai-agent/processors/tool-schema.builder.ts:56-61,93-99,120-122`; `G/src/ai-agent/processors/form-field.indexer.ts:42-46`; `yaraBackoffice.aiAgentConfig.ts:969-973`; `V/RAPIDA/RAPIDA CODE GENERATOR.md:70`; `P/src/interfaces/ai-agent.interface.ts:68-71`.
- **Skill**: DSL (campo novo), MOTOR (schema e aviso).
- **Risco**: aditiva. O aviso pode aparecer em projetos existentes; começar como aviso.
- **Validar**: testes em `tool-schema.builder.test.ts` (descrição do id; aviso de campo obrigatório ausente). LIVE na Yara: `consultar_cotacao` com CPF informado.
- **Dependências**: nenhuma. Se o rename `fieldId` → `fieldName` for aprovado, fazer no mesmo lote.

#### I-19 — Descrição das tools dinâmicas é pobre quando o contrato não tem `userStory`

- **Realidade**: sem `userStory`, a descrição vira `Executa a ação "get" no recurso "/products". Palavras-chave de intenção: ...`. Foi o que saiu para as duas tools do `katia`. É o texto que o LLM usa para decidir quando chamar. Não há como descrever a tool no binding.
- **Expectativa**: `IAgentContractBinding.description?` com precedência sobre `userStory`. Aviso na geração quando nenhum dos dois existe.
- **Evidência**: `G/src/ai-agent/processors/tool-generator.processor.ts:168-178`; `P/src/interfaces/ai-agent.interface.ts:133-162`. No agente gerado, `src/tools/dynamic/consultar-preco-produto.tool.ts` trazia exatamente o texto acima.
- **Skill**: DSL, MOTOR; PROJ para preencher nos bindings existentes.
- **Risco**: aditiva.
- **Validar**: teste unitário em `tool-generator.processor`. LIVE no `autoCenterBackoffice` ("qual a próxima revisão do meu carro").
- **Dependências**: nenhuma.

#### I-20 — Prompt literal: placeholders não documentados, lista de tools à mão, texto duplicado

- **Realidade**: quatro projetos carregam o prompt inteiro dentro do `.ts` (de 30 a 480 linhas), copiado de arquivos `.md` que ficam ao lado como "fonte". O `katia` tem um `prompts/system.template.md` órfão. Prompt literal lista as tools à mão; ao trocar uma tool, a lista fica errada sem aviso. Os placeholders `{{CURRENT_DATE}}`, `{{ASSISTANT_NAME}}` e `{{USER_NAME}}` só existem no template do gerador; a DSL não os cita, e os projetos explicam em comentário que "não é interpolação JS". `knowledgeBaseFile` é obrigatório, mas é só o caminho de saída.
- **Expectativa**: placeholders documentados na DSL. Novo placeholder `{{TOOLS_TABLE}}`, que o gerador troca pela tabela real (fixas ativas + dinâmicas). Aviso quando um prompt literal cita uma tool inexistente ou não cita uma tool gerada. `knowledgeBaseFile` opcional, com padrão `data/knowledge.md`. Convenção em rapida-projects para ler prompt e base de um `.md` na montagem.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:13-23`; `T/prompts/system.template.md.ts:22-26`; `T/services/conversation/system-prompt-builder.template.ts:23-27`; `katia.ts:103-132` (lista à mão em `:115-127`); `J/projects/aiAgent/katia/prompts/system.template.md`; `yaraBackoffice.aiAgentConfig.ts:6-12,496-497`; `J/projects/aiAgent/yara/about/`; `kunlatalkBackoffice.aiAgentConfig.ts:7-13`.
- **Skill**: DSL (comentários, `knowledgeBaseFile` opcional), MOTOR (`{{TOOLS_TABLE}}` e avisos), PROJ (adotar).
- **Risco**: aditiva.
- **Validar**: teste unitário de `getSystemPromptTemplate` (substituição; aviso de tool desconhecida). LIVE: persona da Karol igual depois de adotar o placeholder.
- **Dependências**: depois de I-15 (a tabela depende das tools ativas).

#### I-21 — Instagram é stub e Telegram não tem credencial na DSL

- **Realidade**: `"instagram"` gera um webhook que responde 200 e descarta a mensagem; a geração só avisa. `"telegram"` gera um adaptador real, mas `TELEGRAM_BOT_TOKEN` sai sempre vazio. O `katia` declara os três.
- **Expectativa**: conforme D6. Na recomendada: remover `"instagram"` do union e do schema, apagar o template e criar um campo de credencial para o Telegram.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:38-41`; `P/src/schemas/ai-agent-config.ref.json:35-41`; `G/src/ai-agent/index.ts:31-36`; `T/messengers/instagram.messenger.template.ts:29`; `T/base/env/env-content.builder.ts:51-55`; `katia.ts:138`.
- **Skill**: DSL, MOTOR, PROJ.
- **Risco**: breaking mecânica. Afeta só `katia`.
- **Validar**: testes unitários de `getMessengerTemplates` e do resolver de segredos. Geração do `katia`. Telegram sem LIVE (a skill só cobre WhatsApp); registrar como não testado.
- **Dependências**: **bloqueado por D6**.

#### I-22 — `jobs.reminder.cronInterval` × `IBackend.scheduledJobs`

- **Realidade**: o rapida-partner 3.4.0 criou `IBackend.scheduledJobs` justamente para não repetir o `cronInterval` do `aiAgentConfig`, mas o `aiAgent` continua com o campo próprio. A DSL passa a ter dois lugares para cron e fuso. Os 6 projetos declaram `jobs.reminder`.
- **Expectativa**: conforme D5a. Na recomendada: id `"aiAgentAppointmentReminder"` em `scheduledJobs`; `cronInterval` e `timezone` saem de `jobs.reminder`; o gerador lê do backend selecionado pela CLI.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:116-130`; `P/src/interfaces/scheduled-job.interface.ts:1-16`; `P/src/interfaces/project-backend.interface.ts:118-119`; `P/docs/architecture-review-2026-11-16.md:145`; `T/config/rules.template.json.ts:18-28`; `katia.ts:183-190`.
- **Skill**: DSL, MOTOR, PROJ.
- **Risco**: breaking mecânica nos 6 projetos.
- **Validar**: teste unitário de `getRulesConfigTemplate` lendo de `scheduledJobs`. Geração do `katia` com o mesmo `config/rules.json`.
- **Dependências**: **bloqueado por D5**. Exige a PR kunlatek/rapida-partner#20 mergeada e os projetos em rapida-partner ≥ 3.4.0.

#### I-23 — `humanHandoff`: só WhatsApp, telefone não validado, mesma limitação de janela

- **Realidade**: a escalada envia texto livre pelo mensageiro da conversa para um número de WhatsApp. Em uma conversa pelo Telegram, tentaria mandar para um telefone pelo Telegram. O schema aceita qualquer string: um projeto tem `"+55PREENCHER"` e gera sem aviso. O humano só recebe se tiver falado com o número do agente nas últimas 24 h (mesma regra de I-04; a confirmar no LIVE). A escalada não fica registrada no backend.
- **Expectativa**: validação E.164 no schema. A escalada sempre usa o mensageiro WhatsApp e falha com clareza quando ele não está ativo. A limitação de janela fica documentada na DSL, com a mesma solução de D5c.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:89-100,164-179`; `P/src/schemas/ai-agent-config.ref.json:179-181`; `T/tools/escalation/escalate-to-human.tool.template.ts:62-80`; `T/index/messenger-bootstrap.template.ts` (`sendToPhone` usa o mensageiro corrente); `ficharapidaComercial.aiAgentConfig.ts:536-537`.
- **Skill**: DSL (schema), MOTOR, PROJ (`ficharapidaComercial`).
- **Risco**: breaking mecânica para `ficharapidaComercial` (o placeholder deixa de validar). Os demais, aditiva.
- **Validar**: teste do schema no rapida-partner (número inválido reprova). LIVE na Yara: provocar escalada e conferir o recebimento.
- **Dependências**: a parte da janela depende de D5c.

#### I-24 — Áudio depende de uma chave que a DSL não exige

- **Realidade**: a transcrição precisa de `openaiIntegration` com `service: "transcription"`. Só a Karol declara. Nos outros cinco, o agente responde "não consigo processar áudios" a cada áudio. Declarar `audio` sem a chave não gera aviso. `ffmpeg` e `fluent-ffmpeg` são instalados sempre.
- **Expectativa**: aviso na geração quando `audio` está declarado e não há chave. Comentário da DSL diz que, sem chave, o áudio fica desligado. Dependências de áudio só quando há chave.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:102-111`; `T/base/env/env-secrets.resolver.ts:27-39`; `T/index.template.ts:116-119`; `T/messengers/whatsapp/whatsapp-audio-processor.template.ts:27-31`; `J/projects/aiAgent/kunlatalk/kunlatalkAgent/kunlatalkBackoffice.ts:108-112`; `T/base/dockerfile.template.ts:10-13`.
- **Skill**: MOTOR, DSL (comentário).
- **Risco**: aditiva.
- **Validar**: teste unitário do diagnóstico. LIVE na Karol: enviar um áudio.
- **Dependências**: junto com I-08.

#### I-25 — Usuário do bot criado à mão

- **Realidade**: o agente faz login com e-mail e senha de um usuário que alguém precisa criar no backend alvo e ao qual precisa dar permissões. `botCredentials` é opcional. Quatro projetos não declaram, e o `.env` sai vazio.
- **Expectativa**: conforme D4. Na recomendada: `botCredentials` obrigatório; o backend gerado cria o usuário de serviço de forma idempotente, com papel limitado às entidades que as tools tocam.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:73-86`; `P/src/schemas/ai-agent-config.ref.json:147-162`; `T/base/env/env-content.builder.ts:77-82`; declaram: `kunlatalkBackoffice.aiAgentConfig.ts:455-458`, `pierZero8Backoffice.aiAgentConfig.ts:139-142`; não declaram: `katia.ts`, `autoCenterBackoffice.aiAgentConfig.ts`, `yaraBackoffice.aiAgentConfig.ts`, `ficharapidaComercial.aiAgentConfig.ts`.
- **Skill**: DSL (obrigatoriedade), FRONT/BACK (seed no Nest), MOTOR (README e verificação no bootstrap), PROJ (segredos).
- **Risco**: **breaking manual**. `katia`, `autoCenterBackoffice`, `yaraBackoffice` e `ficharapidaComercial` precisam de segredo novo no Infisical do tenant. Yara e Auto Center já estão implantados com credenciais preenchidas fora do projeto; alinhar os valores para não trocar a senha em produção sem querer.
- **Validar**: teste unitário do seed no gerador Nest. LIVE: subir backend limpo e conversar sem criar usuário à mão.
- **Dependências**: **bloqueado por D4**. Antes de I-08 virar erro para `botCredentials`.

#### I-26 — Consistência da DSL do agente com o resto

- **Realidade**:
  - Os comentários de `ai-agent.interface.ts` estão em inglês; as interfaces novas da DSL estão em pt-BR.
  - `aiAgentConfig` não tem o comentário "Só para skeleton ..." que `store` e `referralCuration` têm.
  - As credenciais de WhatsApp do agente ficam em `IBackend.whatsapp`, campo do backend, sem comentário dizendo que o agente as usa.
  - O loader mistura português e inglês na mesma mensagem. Os logs do motor alternam os dois idiomas.
  - O schema não exige ao menos um mensageiro.
  - Sobrou um cabeçalho de rascunho em `tool-generator.processor.ts`.
- **Expectativa**: comentários em pt-BR. Comentário de escopo em `aiAgentConfig` e em `IBackend.whatsapp`. Mensagens do gerador em um idioma só. `minItems: 1` em `messengers`.
- **Evidência**: `P/src/interfaces/ai-agent.interface.ts:13-130` contra `P/src/interfaces/project-backend.interface.ts:61-77,116-119` e `P/src/interfaces/project.interface.ts:92,95-99`; `T/template.interface.ts:14-17`; `G/src/ai-agent/target-backend.loader.ts:23-26`; `G/src/ai-agent/processors/tool-generator.processor.ts:1,65-68,95-97`; `P/src/schemas/ai-agent-config.ref.json:35-41`.
- **Skill**: DSL, MOTOR.
- **Risco**: aditiva. `minItems: 1` não quebra nenhum projeto.
- **Validar**: `bun test src/ai-agent`; validação do schema com os 6 projetos.
- **Dependências**: por último entre os lotes de DSL, para não conflitar com quem edita os mesmos comentários.

### 3.5 O que é gerado junto

#### I-27 — Front de `aiAgent` não tem rota raiz: o painel é gerado e fica inalcançável

- **Realidade**: `skeleton.generator.ts` gera layout e painel de backoffice para `aiAgent` (por `default` em `main`, por `case "aiAgent"` na PR #66). Mas `app-root.template.ts` só cria a rota `''` quando `skeleton === "backoffice"` ou é loja. No front gerado do `katia`, `src/app/dashboard/dashboard.component.ts` existe e `app.routes.ts` não tem rota para `''`. Quem faz login cai numa área vazia. Quatro projetos declaram gráficos em `dashboard` que ninguém vê na tela inicial.
- **Expectativa**: `aiAgent` (e `service`) tratados como backoffice também na rota raiz.
- **Evidência**: `G/src/frontend/angular/ui/flowbite/templates/base/app-root.template.ts:39,121-127` em `main`; na branch da PR #66 a linha 39 é a mesma e o bloco está em `:123-127`; `G/src/frontend/angular/ui/flowbite/skeletons/skeleton.generator.ts` (`default` em `main`; `case "backoffice": case "aiAgent": case "service":` na PR #66); `dashboard` declarado em `autoCenterBackoffice.ts:344`, `yaraBackoffice.ts:345`, `ficharapidaComercial.ts:174`, `kunlatalkBackoffice.ts:131`.
- **Skill**: FRONT/BACK.
- **Risco**: aditiva. Corrige os 6.
- **Validar**: teste unitário de `getAppRoutesTemplate` com `skeleton: "aiAgent"`. Gate Playwright da skill FRONT/BACK. Abrir `/` no front gerado do `katia`.
- **Dependências**: fazer **sobre a PR #66 já mergeada**. O conserto ideal é uma função única (por exemplo `isBackofficeSkeleton`) usada por `skeleton.generator.ts` e `app-root.template.ts`. Não depende de D2.

#### I-28 — Agente só é gerado com `skeleton: "aiAgent"`; `aiAgentConfig` em outro skeleton é ignorado em silêncio

- **Realidade**: a CLI testa o skeleton, não a presença de `aiAgentConfig`. Um projeto `backoffice` com `aiAgentConfig` gera front e back e pula o agente sem aviso. Aconteceu com a Yara por meses.
- **Expectativa**: conforme D2. Na recomendada: gerar o agente quando `aiAgentConfig` existe. Enquanto D2 não for decidida, no mínimo avisar quando há `aiAgentConfig` com outro skeleton.
- **Evidência**: `G/cli.ts:172-191`; `V/RAPIDA/RAPIDA CODE GENERATOR.md:68`.
- **Skill**: FRONT/BACK (`cli.ts` fica fora de `src/ai-agent`), DSL (comentário do skeleton).
- **Risco**: o aviso é aditivo. A opção B é aditiva enquanto `"aiAgent"` for aceito. Conferir antes se algum projeto de outro skeleton tem `aiAgentConfig` esquecido, pois passaria a gerar agente.
- **Validar**: teste da decisão extraída de `cli.ts` para função pura. Geração do `katia`.
- **Dependências**: aviso, nenhuma. Mudança de gatilho, **bloqueada por D2**.

#### I-29 — Credencial de WhatsApp do agente liga recursos do backend sem ninguém pedir

- **Realidade**: o agente lê as credenciais de `backend[].whatsapp`. A simples presença desse bloco faz o backend Nest gerar o módulo `whatsapp-flows`, a entidade de permissão e o monitoramento de custo do WhatsApp. O `katia-api` gerado veio com `WhatsappFlowsModule`, que o projeto não pediu. As mesmas credenciais vão para dois `.env`.
- **Expectativa**: separar "credenciais que o agente usa" de "o backend deve gerar fluxos de WhatsApp". Duas saídas possíveis: mover as credenciais do agente para `aiAgentConfig` (por ambiente), ou manter em `IBackend.whatsapp` e condicionar os fluxos do backend a uma declaração explícita.
- **Evidência**: `T/base/env/env-secrets.resolver.ts:45,52-54`; `G/src/backend/nest/processors/whatsapp-flows.processor.ts:25-50`; `G/src/backend/nest/processors/features.processor.ts:77-103`; `G/src/backend/nest/mongodb/templates/base/config/env.template.ts:70-88`. Na geração real, `katia-api/src/app.module.ts` importava `WhatsappFlowsModule`.
- **Skill**: FRONT/BACK; DSL se as credenciais mudarem de lugar.
- **Risco**: mover as credenciais é breaking mecânica nos 6. Condicionar os fluxos pode desligar algo em uso: conferir antes se algum backoffice usa `whatsapp-flows` de verdade.
- **Validar**: teste unitário de `processWhatsappFlows`. Geração do `katia` sem `whatsapp-flows`. LIVE: agente continua recebendo.
- **Dependências**: levantar o uso real de `whatsapp-flows` antes de escolher a saída. Não bloqueia os demais.

### 3.6 Projetos

#### I-30 — `katia.ts` precisa funcionar de verdade para servir de referência

- **Realidade**: `katia` é o projeto do gate de regressão da skill MOTOR e não conversa como declarado: sem chave de provedor, sem `botCredentials`, sem módulo de histórico, com Instagram e Telegram declarados sem credencial, com lista de tools escrita à mão no prompt e um arquivo de prompt órfão.
- **Expectativa**: incluir o módulo de WhatsApp (histórico), `deepseekIntegration` com `service: "chat"`, `botCredentials`, só mensageiros com credencial. Usar `{{TOOLS_TABLE}}` quando existir. Apagar ou adotar `prompts/system.template.md`.
- **Evidência**: `J/projects/aiAgent/katia/katia.ts:138,183-198` e ausência de `deepseekIntegration`, `openaiIntegration` e `botCredentials` no arquivo; `J/projects/aiAgent/katia/prompts/system.template.md`; `.env` gerado com as cinco variáveis vazias (I-08).
- **Skill**: PROJ.
- **Risco**: mexe só no `katia`. Exige segredos no tenant `kunlatek-dev` (chave do DeepSeek já existe em `constants/secrets/kunlatek-dev/ai`; usuário do bot, não).
- **Validar**: geração + `bun install && bun run build` no agente. LIVE do `katia` (primeira vez).
- **Dependências**: módulo de histórico e chave do provedor já podem ir. `botCredentials` depende de D4. Mensageiros dependem de D6.

#### I-31 — Segredos que faltam nos projetos

- **Realidade**: três projetos só têm chave do DeepSeek com `service: "cost"`, que o agente não usa. Quatro não têm `botCredentials`. O agente implantado funciona porque alguém preencheu as variáveis à mão no Coolify, fora do projeto.
- **Expectativa**: cada projeto declara tudo o que o agente precisa, vindo de `constants/secrets/<tenant>/`.
- **Evidência**: I-08 (DeepSeek) e I-25 (bot); `J/constants/secrets/secret.ts` (comentário sobre `BOT_API_*` do `pier-zero-8` não provisionado).
- **Skill**: PROJ.
- **Risco**: **breaking manual**. Adicionar a entrada `"chat"` é mecânico. Criar os segredos do bot em cada tenant do Infisical e alinhar com o que está no Coolify é trabalho por projeto e precisa de alguém com acesso.
- **Validar**: geração de cada projeto dentro de `infisical run`; conferir que as chaves do `.env` estão preenchidas, sem imprimir valores.
- **Dependências**: parte do bot **bloqueada por D4**. Deve terminar antes de I-08 virar erro.

#### I-32 — Organização dos projetos `aiAgent`

- **Realidade**: quatro projetos estão em `projects/aiAgent/` e dois em `projects/backoffice/` (`yaraBackoffice`, `pierZero8`). Existe uma pasta `projects/aiAgent/yara/` só com material de apoio. O Pier Zero 8 exporta a constante `example` com `id: "example"`. O vault aponta para caminhos antigos.
- **Expectativa**: conforme D2. Se o agente vira capacidade (opção B), a pasta `aiAgent/` deixa de ser critério e o lugar natural é `backoffice/`. Se continua skeleton (opção A), os dois projetos vão para `aiAgent/`. Em qualquer caso: material de apoio junto do projeto e id real no Pier Zero 8.
- **Evidência**: `J/projects/backoffice/kunlatalk/yaraBackoffice/yaraBackoffice.ts:105`; `J/projects/backoffice/pierZero8/pierZero8Backoffice.ts:20-25`; `J/projects/aiAgent/yara/{about,assets,openapi}`; `V/KUNLATALK.md` (última linha, caminho inexistente).
- **Skill**: PROJ; `obsidian-knowledge-capture` para atualizar os caminhos no vault.
- **Risco**: breaking mecânica (caminhos). Mudar o `id` do Pier Zero 8 muda o nome das pastas geradas e do agente (`example-agent`): conferir os repositórios de destino antes.
- **Validar**: montagem e geração dos projetos movidos.
- **Dependências**: **bloqueado por D2**.
- **Andamento (2026-11-17, D2 = B):** feito em kunlatek/rapida-projects#68 o material de apoio da Yara junto do projeto e o id real do Pier Zero 8 (`pierZero8Backoffice`). **Pendente, pós-merge:** mover `katia`, `autoCenterBackoffice`, `kunlatalkBackoffice` e `ficharapidaComercial` de `projects/aiAgent/` para `projects/backoffice/<cliente>/`, num PR à parte depois que a pilha de PRs de projetos (#61 a #68) for mergeada, para não gerar conflito de rename. No mesmo PR: atualizar o caminho do `katia` no gate da skill MOTOR (agents-library) e os caminhos nos documentos do vault. Não separar backoffice e agente em dois projetos (seria a opção C da D2). Saber se um projeto tem agente pela presença de `aiAgentConfig`, não pela pasta.

#### I-33 — Desligar agenda onde ela não existe

- **Realidade**: Yara e Pier Zero 8 não usam agendamento e carregam as tools. A Yara tem trechos de prompt só para proibi-las.
- **Expectativa**: `capabilities.scheduling: false` nos dois; remover do prompt da Yara as proibições que deixam de fazer sentido; o prompt padrão do Pier Zero 8 sai sem a seção de agenda.
- **Evidência**: `yaraBackoffice.aiAgentConfig.ts:743-758,816-830`; `pierZero8Backoffice.aiAgentConfig.ts:9,144-147`.
- **Skill**: PROJ.
- **Risco**: **breaking manual**. O prompt da Yara está em produção e foi afinado por testes reais; a edição é manual e precisa de revalidação.
- **Validar**: LIVE na Yara, repetindo o roteiro de disponibilidade de imóvel de 2026-10-09.
- **Dependências**: depois de I-15. **Bloqueado por D1**.

### 3.7 Testes do gerador

#### I-34 — Gate de regressão automatizado para o agente gerado

- **Realidade**: `bun test src/ai-agent` cobre 5 arquivos: resolução de contracts, schema de tool, montagem do `.env`, resolução de segredos e o parser do DeepSeek. Nenhum teste gera um agente inteiro. Os problemas de I-01, I-05, I-11 e I-16 passariam por todos eles. A checagem de tipos do agente é manual, na skill. A skill ainda cita `generated/ai-agent/katia`; o diretório real é `generated/ai-agent/katia-agent`.
- **Expectativa**: um teste que gera um agente a partir de uma fixture pequena, sem segredos, em diretório temporário, e verifica: arquivos esperados por combinação de mensageiro, provedor e `capabilities`; nenhuma variável do `.env` sem leitor; nenhum `console.` fora do logger; endpoints implícitos validados. Um script que roda `tsc --noEmit` no resultado.
- **Evidência**: arquivos de teste existentes: `G/src/ai-agent/processors/contract-resolver.processor.test.ts`, `tool-schema.builder.test.ts`, `T/base/env/env-content.builder.test.ts`, `T/base/env/env-secrets.resolver.test.ts`, `T/ai-providers/deepseek/deepseek-dsml-parser.template.test.ts`; `G/package.json` (script `test`); `agents-library/.agents/skills/rapida-code-generator-ai-agent-execution/SKILL.md` (seção 3.2.4); `G/src/ai-agent/index.ts:42-43` (sufixo `-agent`).
- **Skill**: MOTOR; a correção do texto da skill é feita em `agents-library`.
- **Risco**: aditiva.
- **Validar**: o próprio teste. Confirmar que ele falha no estado atual para I-01 e I-11 antes das correções.
- **Dependências**: nenhuma. **Fazer primeiro**: os demais itens usam esse teste como rede.

---

## 4. Ordem de execução sugerida

Antes de tudo: mergear a PR kunlatek/rapida-partner#20 (3.4.0) e a PR kunlatek/rapida-code-generator#66, e atualizar o checkout local do gerador, que está 16 commits atrás. Os lotes abaixo supõem as duas mergeadas.

Cada lote vira uma PR por repositório. Lotes do mesmo número em repositórios diferentes devem ser mergeados na ordem DSL → gerador → projetos.

| Lote | Conteúdo | Repositórios | Depende de | Risco |
| --- | --- | --- | --- | --- |
| **0. Rede de segurança** | I-34 | gerador (+ texto da skill em agents-library) | — | aditiva |
| **1. Correção de runtime** | I-01, I-02, I-03, I-05, I-09; parte de I-30 (módulo de histórico e chave do provedor no `katia`) | gerador, projetos | Lote 0 | aditiva (I-01 exige o ajuste do `katia` no mesmo lote) |
| **2. Segurança e dados pessoais** | I-06, I-07, I-10 | gerador, projetos (segredo do app no Pier Zero 8) | Lote 1 (I-07 usa I-02) | aditiva, muda comportamento |
| **3. Configuração e empacotamento** | I-08 como aviso, I-11, I-12, I-13, I-14 (textos), I-24 | gerador, DSL (`geminiIntegration`) | Lote 1 | aditiva |
| **4. Painel e gatilho do agente** | I-27, I-28 (só o aviso) | gerador | PR #66 mergeada | aditiva |
| **5. DSL aditiva** | I-15, I-16, I-18, I-19, I-20, I-23, I-17 (parte mínima) | DSL (3.5.0), gerador, projetos | **D1**; Lotes 0 e 3 | aditiva; I-23 quebra a validação de `ficharapidaComercial` até corrigir o telefone |
| **6. Projetos sobre a DSL nova** | I-33, resto de I-30, descrições de I-19 nos bindings | projetos | Lote 5; **D1** | **breaking manual** (prompt da Yara) |
| **7. Provisionamento** | I-25, I-31, I-08 passa a erro | DSL, gerador (Nest e motor), projetos, Infisical | **D4**; Lote 3 | **breaking manual** |
| **8. Lembrete** | I-22, I-04 | DSL, gerador, projetos | **D5**; Lote 5 (I-15) | breaking mecânica (I-22) e **breaking manual** (I-04) |
| **9. Mudanças breaking da DSL** | I-21, I-17 (opção B), I-28 (mudança de gatilho), I-29, I-32, I-26 | DSL (4.0.0 se algo for removido), gerador, projetos, vault | **D2, D3, D6** | breaking mecânica |

Observações sobre a ordem:

- Os lotes 0 a 4 não dependem de nenhuma decisão e já resolvem o que impede o `katia` de funcionar.
- Se o rename `fieldId` → `fieldName` da revisão de 2026-08-14 for aprovado, o melhor momento é o lote 9, junto das outras migrações mecânicas nos 6 projetos.
- Depois de cada lote que muda o motor, os agentes implantados (Yara, Karol, Auto Center) só recebem a correção ao serem regerados e reimplantados pelo fluxo `rapida → develop`. Agendar um LIVE por agente ao fim dos lotes 1, 2 e 8.

## 5. Resumo

- **Itens**: 34 (I-01 a I-34).
- **Decisões pendentes**: 7 (D1 a D7).
- **Itens breaking com decisão manual**: I-04 (lembrete: destinatário e modelo de mensagem), I-25 (usuário do bot obrigatório e provisionado), I-31 (segredos que faltam nos projetos), I-33 (desligar agenda na Yara e no Pier Zero 8).
- **Itens sem bloqueio por decisão**: I-01, I-02, I-03, I-05 a I-13, I-18, I-19, I-24, I-26, I-27, I-29, I-34, mais as partes mínimas de I-14, I-17, I-23, I-28 e I-30. I-16 e I-20 não dependem de decisão em si, mas ficam melhores depois de I-15 (D1), porque a lista de tools fixas passa a variar.
