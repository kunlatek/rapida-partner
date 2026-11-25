# Changelog

## 8.5.0

### ✨ Novidades

Adicionais e opções do produto (Fase 3.1 do plano de segmentos de loja). Lojas sem a funcionalidade continuam como estão.

- `TStoreFeature` ganha `"productOptions"` (ligada por padrão em food), com o liga e desliga `productOptionsEnabled`.
- `IStoreOptionGroup` (nome, obrigatório, mínimo e máximo de unidades) e `IStoreOption` (grupo, nome, preço padrão, máximo por opção, disponível, insumo e quantidade do insumo), lidos pela loja por `IMarketplace.optionGroupsEndpoint` e `IMarketplace.optionsEndpoint`. O cadastro é reaproveitável: cada produto lista as opções que oferece em `IProductOptionLink` (opção e preço, vazio usa o padrão).
- `IStoreOrderItemSelection` ganha `optionId` e `quantity` (a mesma opção pode entrar mais de uma vez, até `maxQuantity`). `IStoreOrderItem` ganha `selectionsSummary`, as escolhas em texto para o vendedor.
- `STORE_OPTION_MAX_QUANTITY` (10) em `src/utils/store-order.ts`.
- Preço por tipo (Fase 3.2): `IStoreOption.priceType` (`TStoreOptionPriceType`: `"add"`, acréscimo em reais, o padrão; ou `"percentOff"`, desconto em % do preço do produto). Um grupo obrigatório de escolha única com "Inteira" (0%) e "Meia" (50%), ou "Adulto" e "Criança", serve para qualquer produto, qualquer que seja o preço. `IStoreOrderItemSelection.priceDelta` passa a aceitar valor negativo (desconto). A cota de meia-entrada por sessão fica para a fase de sessões.

## 8.4.0

### ✨ Novidades

Linha do pedido com escolhas e observação (Fase 2 do plano de segmentos de loja). Pedidos sem escolhas nem observação continuam como estão.

- `IStoreOrderItem` ganha `selections` (`IStoreOrderItemSelection`: grupo, opção e acréscimo de preço) e `note` (observação do cliente). Duas linhas do mesmo produto com escolhas ou observação diferentes são linhas separadas. As opções e os acréscimos são preenchidos pelas fases seguintes; esta versão só define onde a linha os guarda.
- `TStoreFeature` ganha `"itemNotes"` (observação por item, ligada por padrão em food), com o liga e desliga `itemNotesEnabled`. `STORE_ITEM_NOTE_MAX_LENGTH` (140) em `src/utils/store-order.ts`.

## 8.3.0

### ✨ Novidades

Segmento da loja. Projetos sem o campo continuam como estão.

- `IProjectStore.segment` (`TStoreSegment`: `"retail"`, `"food"`, `"services"` ou `"events"`): um segmento por loja. Ele escolhe os padrões do segmento (textos, funcionalidades ligadas, rótulos do andamento do pedido, etapas do checkout); cada funcionalidade continua podendo ser ligada ou desligada em `features`. Sem ele, a loja se comporta como `"retail"`.
- Sem `features`, vale o padrão do segmento (`STORE_SEGMENT_DEFAULT_FEATURES` em `src/utils/store-segment.ts`); com a lista, ela sempre vale, mesmo vazia. `storeFeaturesOf(store)` devolve a lista que vale, para o gerador e para o `getStoreSettingsModule`. Padrões: retail com tudo menos o blog; food com `whatsappButton`, `favorites`, `coupons` e `reviews`; services com `whatsappButton`, `stockAvailability`, `installments`, `coupons` e `reviews`; events com `stockAvailability`, `installments` e `coupons`.
- Catálogo: `IStoreSettings.catalogLayout` (`TStoreCatalogLayout`: grade ou lista), `catalogColumns` (2, 3 ou 4 colunas da grade no computador) e `productImageAspect` (`TStoreImageAspect`: `"auto"`, a foto inteira como sempre, ou recortada em `"square"`, `"landscape"` e `"portrait"`). Sem eles, vale o padrão do segmento (`STORE_SEGMENT_DEFAULT_SETTINGS`): food em lista com foto quadrada, services e events com foto deitada, retail como sempre.
- Horário de funcionamento: `TStoreFeature` ganha `"openingHours"` (ligada por padrão em food) e `IStoreSettings` ganha `openingHours` (`IStoreOpeningHours`: `TStoreWeekday`, `opensAt` e `closesAt` em `"HH:MM"`; fechar antes de abrir atravessa a meia-noite), `timeZone` (fuso IANA, padrão `"America/Sao_Paulo"`), `ordersPaused` e o liga e desliga `openingHoursEnabled`. Fora dos períodos, ou com a loja pausada, a loja não aceita pedidos.
- Retirada na loja: `TStoreFeature` ganha `"pickup"` (ligada por padrão em food), com o liga e desliga `pickupEnabled` e `IStoreSettings.pickupAddress` (vazio usa `address`). `IStoreOrder.deliveryMethod` (`TStoreDeliveryMethod`: `"delivery"` ou `"pickup"`, padrão `"delivery"`): na retirada o pedido não tem endereço nem frete, e `"shipped"` quer dizer pronto para retirar.
- Entrega por bairro: `TStoreFeature` ganha `"districtDelivery"` (ligada por padrão em food), com o liga e desliga `districtDeliveryEnabled` e `IStoreSettings.deliveryDistricts` (`IStoreDeliveryDistrict`: nome, taxa e prazo em texto). O cliente escolhe o bairro numa lista; bairro fora dela não é atendido. Com ela ligada, o frete por faixa de CEP não é usado.
- Pedido mínimo: `IStoreSettings.minimumOrderValue` (subtotal dos itens); 0 ou vazio não exige mínimo.
- Pagar na entrega: `TStoreFeature` ganha `"payOnDelivery"` (ligada por padrão em food), com o liga e desliga `payOnDeliveryEnabled`. `IStoreOrder` ganha `paymentMethod` (`TStorePaymentMethod`: `"online"` ou `"onDelivery"`), `changeFor` (troco para) e `paymentReceived` (o vendedor marca quando recebe). O pedido na entrega não passa pelo Mercado Pago, chega confirmado ao vendedor e baixa o estoque na confirmação.
- Aviso da validação: `store.segment` fora de skeleton `"ecommerce"`/`"marketplace"` é ignorado.

## 8.2.1

### 🐛 Correções

Só avisos da validação; nenhum contrato muda.

- `recordTimestamp` num segundo form do módulo não dá mais aviso: cada form gera a própria entidade e grava o consentimento. O aviso da 8.1.1 estava errado. Agora só avisa quando o form repete a entidade (`contracts[0].id`) de um form anterior, caso em que o gerador não cria o backend dele.
- `kpis.sumOf` e `kpis.filter` são conferidos contra o form da entidade da lista (o que tem o mesmo endpoint do `dataSource`), não contra todos os forms do módulo. Sem form com esse endpoint, continuam conferidos contra os forms do módulo.
- `kpis.sumOf` precisa ser um `input` numérico, como exige a rota de soma do backend gerado. Um select com `dataType` numérico passa a avisar.
- `columnGroup` interrompido por uma coluna sem grupo passa a avisar.
- Testes para `checkListReferences` (`list-references.test.ts`).

## 8.2.0

### ✨ Novidades

Campos opcionais em `IAgentContractBinding.intentMapping.formFields[]` para o agente de IA consultar dados de clientes sem expor registros de terceiros. Bindings sem eles continuam como estão.

- `isRequired` (`boolean`): o parâmetro entra em `required` no schema da tool em qualquer action, inclusive `"get"`, e a tool gerada recusa a chamada sem ele antes de chamar a API.
- `matchMode` (`"exact" | "partial"`, só em `"get"`): `"exact"` compara o texto inteiro (sem diferenciar maiúsculas) em vez de buscar por trecho. Padrão `"partial"`.

## 8.1.1

### 🐛 Correções

Só avisos da validação; nenhum contrato muda.

- `recordTimestamp` dentro de um array ou fora do primeiro form do módulo agora dá aviso: o backend gerado só grava o consentimento no nível de cima do primeiro form, então nesses lugares o aceite não era registrado. Os forms de perfil (`flows.profiles`) também são conferidos.
- A colisão dos campos do consentimento compara o nome como o gerador grava no backend: `accepted-terms` gera `accepted_termsAt`.
- Primeiros testes do pacote (`bun test`), para `checkFormReferences`.

## 8.1.0

### ✨ Novidades

Campos opcionais para escolher como as opções de checkbox e radio aparecem. Forms sem eles continuam como estão.

- `display` (`TChoiceDisplay`, em `choice-display.interface.ts`) em `IFormCheckbox` e `IFormRadio`: `"list"` (padrão, uma opção por linha), `"chips"` (botões lado a lado, para opções curtas como dias da semana) ou `"cards"` (cartões com texto de apoio, para escolhas que mudam o resto do formulário).
- `description` (`TTranslatable`) em `ICheckboxOption` e `IRadioOption`: texto de apoio da opção, mostrado com `display: "cards"`.
- `itemLabel` (`TTranslatable`) em `IFormArray`: nome de um item no singular ("dependente"), usado em "Adicionar dependente", no título de cada item e no remover. Sem ele, a tela usa "item".
- `recordTimestamp` (`boolean`) em `IFormSwitch`: consentimento. Guarda o último aceite e a última revogação, não um histórico completo. Ao ligar, o backend gerado grava a data e o usuário em `<name>At` e `<name>By`; ao desligar, grava a revogação em `<name>RevokedAt` e `<name>RevokedBy`, sem apagar o aceite. Ligar de novo troca o aceite e limpa a revogação. O formulário mostra "Registrado em ..." ou "Revogado em ..." abaixo do switch.
- `kpis` (`IListKpi[]`, até 4) em `IList`: números-resumo acima da tabela. Cada um conta os registros que cumprem todas as condições de `filter` (`IListKpiCondition[]`: `field`, `op` entre `eq`, `ne`, `lt`, `lte`, `gt`, `gte` e `in`, e `value`, com `"$today"` e `"$tomorrow"` para as datas do dia) ou, com `sumOf`, soma esse campo numérico. `tone` (`TTone` ou `"brand"`, no máximo um `brand`) colore o valor. Clicar aplica as condições na lista.
- `views` (`TListView[]`: `"table"` e/ou `"list"`) em `IList`: modos de ver a lista, o primeiro é o padrão. Com os dois, aparece o seletor Tabela/Lista acima dos dados e a escolha fica salva por pessoa e por tela. O modo Lista mostra um card largo por registro, com avatar, título, subtítulo, situação e até 4 campos.
- Tabela larga em `IList`: `columnViews` (`IListColumnView[]`, cada uma com `label` e as `columns` visíveis) liga o seletor de colunas com as visualizações salvas; `columnGroup` (`TTranslatable`) em cada `listItems` agrupa as colunas no cabeçalho e no seletor; `stickyStart` (`boolean`) deixa a identificação fixa à esquerda e as ações à direita enquanto o meio rola.
- `range` (`boolean`) em `IFormDatePicker`, só em `listFilters`: o filtro vira um período com "De" e "Até" e atalhos (hoje, esta semana, este mês, mês passado), e a lista mostra os registros com a data dentro dele. Em formulários é ignorado.
- Avisos novos na validação (`checkListReferences` e `checkFormReferences`): nomes de `columnViews`, `kpis.sumOf` e `kpis.filter` que não existem; `sumOf` não numérico; mais de um KPI `brand`; `columnGroup` separado; `range` fora de `listFilters`; `recordTimestamp` que gera um campo já existente. Os campos de dentro de arrays também são conferidos. No schema, `op: "in"` exige `value` em lista, e os outros operadores não aceitam lista.

### 📝 Documentação

- `IFormFile.maxSize` é o tamanho máximo de cada arquivo, em bytes (5 MB = 5242880). O front-end gerado mostra o limite na área de envio e recusa arquivos maiores.

## 8.0.0

### 💥 Breaking

Os módulos prontos da loja saem do pacote. O `rapida-partner` volta a guardar só contratos (interfaces, enums, schemas e o `index.ts`); instâncias da DSL ficam no `rapida-projects`.

- Removido `src/modules/` (`getStoreSettingsModule`, `getStoreOrdersModule`, `getStoreCouponsModule`, `getStoreReviewsModule`, `getStoreReturnsModule`, `getStoreBlogModule`). Eles estão agora em `rapida-projects/src/modules/store/`, com o mesmo conteúdo.
- Migração: troque `rapida-partner/src/modules/<módulo>/...` por `src/modules/store/<módulo>/...` do `rapida-projects`. O `rapidaObject.json` gerado não muda.
- Interfaces, schemas e `IMarketplace` não mudam; só os comentários passam a apontar para o `rapida-projects`.

## 7.3.0

### ✨ Novidades

Campos opcionais em `IList` para a tabela padrão das listas. Listas sem eles continuam como estão.

- `description` (`TTranslatable`): frase abaixo do título, dizendo para que a lista serve.
- `tabs` (`IListTabs`): abas com contador acima da tabela, uma por valor de `property` mais "Todos". `options` (`IListTabOption[]`: `label` e `value` como no `ISelectOption`, mais `tone`) é opcional: sem ela, valem as opções do select de mesmo nome no form do módulo, com a cor de cada valor em `tones`. `showCounts` (padrão `true`) liga os contadores.
- `quickFilters` (`string[]`, até 2): `name` dos `listFilters` que ficam ao lado da busca; os demais vão para a área "Mais filtros", que abre abaixo da busca. Sem o campo, a barra mostra só a busca e o botão "Filtros", e todos os filtros ficam na área.
- Em `listItems`:
  - `tones` (`Record<string, TTone>`): tom de cada valor de uma coluna `badge` (`neutral`, `success`, `warning`, `danger`). Em outros tipos de coluna é ignorado.
  - `mobilePriority` (`1 | 2 | 3`): 1 e 2 aparecem no card do celular; 3 só no desktop.
  - `relativeDate` (`"plain" | "deadline"`): texto relativo abaixo da data ("há 3 dias", "em 4 dias"); `deadline` pinta o passado de vermelho e os próximos 7 dias de âmbar.

- `TTone` (`tone.interface.ts`, schema `tone.ref.json`): tom de cor único, usado pelas listas e pelo `IDataStat`. `TDataStatTone` continua existindo como apelido de `TTone`.
- `bun index.ts` avisa quando `quickFilters` cita um nome fora de `listFilters` ou quando `tabs.property` não existe em nenhum form do módulo (sem `tabs.options`).

Requer o `rapida-code-generator` com a tabela padrão (rapida-code-generator#100).


## 7.2.0

### ✨ Novidades

- `IDataStat` (`componentType: "dataStat"`): indicador numérico (KPI) para `IProject.dashboard`. Um único valor calculado sobre os registros de um endpoint, como um `IDataChart` sem agrupamento: `value.aggregator` (`sum`, `avg`, `min`, `max`, `count`, o mesmo `IChartAggregator`), `value.property` e `value.dataType` (`EDataType`, que define a formatação: moeda, data, número). `filters` (`{ key, comparisonOperator, value }`, como `IConditionElement`) aceita os operadores de `IConditionElement` e datas relativas (`"$today"`, `"$startOfMonth"`, `"$startOfNextMonth"`…). `tone` define a cor do card conforme o valor (`neutral`, `success`, `warning`, `danger`), com regras no formato dos filtros sem o `key` (ex.: `> 0` → `danger`). `link` torna o card clicável; `action` (`{ label, route }`, `IDashboardLinkAction`) põe uma chamada de ação no rodapé (ex.: "Resolver agora"). `space` define a largura na grade do painel.
- `IProject.menu.quickCreate` (`IQuickCreateItem[]`): atalhos de criação declarados uma vez (`formId`, `label`, `icon`). Viram o botão "Criar novo" no cabeçalho do painel e alimentam o card `quickCreate`; cada atalho só aparece para quem pode criar no módulo.
- `IDataChart`: `chartType: "progressList"` (barras horizontais em HTML com o número ao lado, na ordem das opções do select agrupado), `data.labels.colors` (cor por valor: `neutral`, `primary`, `success`, `warning`, `danger`), `subtitle` (aceita `{{total}}`) e `action` (link no canto do card).
- `emptyState` (`IDashboardEmptyState`) em `IDataChart` e `IDataStat`: ícone, título, explicação e ações (`primary`/`secondary`) no lugar da mensagem padrão quando não há dados.
- `IProject.dashboard` passa a ser `TDashboardItem[]` (`IComponent | IDashboardBudgetMonitor | IDashboardQuickCreate`, schema `dashboard-item-one-of.ref.json`). Widgets que só existem no painel, fora de `IComponent` e dos módulos: `budgetMonitor` (card de consumo de serviços; requer `deepseekIntegration` ou `mongodbIntegration` com `service: "cost"`) e `quickCreate` (card de atalhos de criação).

Aditiva: projetos sem `dataStat` não mudam. Requer o `rapida-code-generator` com suporte a `dataStat` no painel.


## 7.1.0

### ✨ Novidades

- `IBackend.aiAgentWhatsapp`: credenciais do WhatsApp que o agente de IA usa, separadas de `IBackend.whatsapp`. `whatsapp` continua ligando os fluxos de WhatsApp do backend (webhooks, envio, grupos) e o monitoramento de custo; `aiAgentWhatsapp` não gera os fluxos, só o monitoramento. Sem o campo novo, o agente ainda lê `whatsapp` (o gerador avisa).

Aditiva: os projetos com agente migram quando quiserem parar de gerar fluxos de WhatsApp que não usam.

### 📝 Documentação

- Comentários de `IAiAgentConfig` e as descrições do schema do agente em pt-BR, como o resto da DSL.


## 7.0.0

### 💥 Mudanças que quebram

- `businessContext.targetBackendProjectId` (nunca lido) e `businessContext.targetBackendDefinitionFile` saem. No lugar, `businessContext.targetBackend: { definitionFile, baseUrl }` torna o backend em outro projeto Rapida de primeira classe: o agente resolve contratos, endpoints das tools fixas e histórico só no projeto alvo e chama a URL dele (`BOT_API_BASE_URL`). O usuário do bot precisa existir no backend alvo. Migração mecânica: remover `targetBackendProjectId` dos projetos (nenhum usava `targetBackendDefinitionFile`).


## 6.1.1

### 📝 Documentação

- `aiAgentConfig` passa a ser descrito como capacidade do projeto: o gerador cria o agente sempre que ele existe, em qualquer skeleton. `skeleton: "aiAgent"` fica documentado como sinônimo de `"backoffice"`. Requer o `rapida-code-generator` com a decisão D2 aplicada.

## 6.1.0

Segunda rodada de contratos do Grupo B da evolução do skeleton ecommerce/marketplace (itens L17, L20, L25, L26, L27 e L28). Todas as mudanças são aditivas: nenhum projeto existente precisa mudar. O comportamento novo na loja depende de suporte no `rapida-code-generator`; no Backoffice do vendedor, os módulos prontos já geram telas e rotas comuns.

### ✨ Novidades

- **Cupom** (L17): `TStoreFeature` ganha `"coupons"`. Módulo pronto `getStoreCouponsModule` (`src/modules/store-coupons`), com lista e formulário "Cupons" e o contrato público `storeCouponsFromStore` (get, `trustedCallers` por padrão; um código por workspace). Tipo `IStoreCoupon` (`TStoreCouponDiscountType`: percentual ou valor fixo; pedido mínimo, validade e limites de uso total e por cliente). A loja aponta para ele em `IMarketplace.couponsEndpoint`; o uso é contado pelos pedidos da loja.
- **Páginas institucionais e legais** (L20): `IStoreSettings` ganha `aboutText`, `privacyPolicyText`, `termsText`, `returnsPolicyText` (texto rico) e `cookieNoticeText`. O módulo `getStoreSettingsModule` ganha a aba "Páginas". Cada página só é publicada quando tem texto.
- **Banners e destaques** (L25): `IStoreSettings` ganha `banners` (`IStoreBanner`: imagem, título, subtítulo, link e texto do botão), `benefits` (`IStoreBenefit`: ícone Lucide, título e texto) e `featuredProductIds`. O módulo de configuração ganha a aba "Vitrine"; a nova opção `featuredProductsApi` diz de onde vêm os produtos (padrão `/products`).
- **Avaliações** (L26): `TStoreFeature` ganha `"reviews"`. Módulo pronto `getStoreReviewsModule`, com moderação (`TStoreReviewStatus`) e resposta do vendedor, contrato público `storeReviewsFromStore` (create, get; uma avaliação por produto e pedido) e a agregação `rating` (soma das notas e contagem, para a média). Tipo `IStoreReview`. A loja aponta para ele em `IMarketplace.reviewsEndpoint`.
- **Devolução e troca** (L27): `TStoreFeature` ganha `"returns"` e `IStoreSettings.returnWindowDays` (prazo para pedir, em dias após a entrega). Módulo pronto `getStoreReturnsModule`, contrato público `storeReturnsFromStore` (create, get). Tipo `IStoreReturnRequest` (`TStoreReturnType`, `TStoreReturnReason`, `TStoreReturnStatus`, `IStoreReturnItem`). A loja aponta para ele em `IMarketplace.returnsEndpoint`; o reembolso continua sendo da loja.
- **Blog** (L28): módulo pronto `getStoreBlogModule` para a funcionalidade `"blog"`, que já existia, com artigos (título, nome na URL, resumo, capa, conteúdo em texto rico, data de publicação) e o contrato público `storeBlogPostsFromStore` (get, getById). Tipo `IStoreBlogPost`. A loja aponta para ele em `IMarketplace.blogPostsEndpoint`.
- `IContractAggregation.count`: inclui em cada grupo o número de registros em `count`.

## 6.0.0

### 💥 Mudanças que quebram

- `aiAgentConfig.infrastructure.messengers` deixa de aceitar `"instagram"`: o adaptador gerado era um stub que descartava as mensagens. O schema passa a exigir ao menos um mensageiro, sem repetição. Migração mecânica: tirar `"instagram"` da lista (só o `katia` declarava).

### ✨ Novidades

- `IBackend.telegram.telegramBotToken`: token do bot do Telegram, por ambiente, para o agente com o mensageiro `"telegram"`. Antes não havia campo e o `TELEGRAM_BOT_TOKEN` saía sempre vazio. Telegram segue sem validação em conversa real.


## 5.0.0

### 💥 Mudanças que quebram

- `aiAgentConfig.businessContext.botCredentials` passa a ser obrigatório, com e-mail (mínimo 3 caracteres) e senha (mínimo 8). O backend Nest gerado cria esse usuário de serviço ao subir, de forma idempotente e com a senha do `.env`, no workspace do dono (`flows.invitation.mainUserEmail`), com o papel `"aiAgent"` limitado às entidades que as tools do agente usam. Migração manual: cada projeto precisa de segredo próprio no Infisical do tenant.


## 4.1.0

### ✨ Novidades

- `IAiAgentConfig.capabilities` (`identity`, `scheduling`, `knowledgeBase`, `media`, todos `true` por padrão): liga ou desliga cada grupo de tools fixas. Grupo desligado não é gerado, não aparece no prompt padrão nem na conferência de endpoints; o lembrete só existe com `scheduling`.
- `IAgentContractBinding.description`: texto que o LLM lê para decidir quando chamar a tool, com precedência sobre o `userStory` do contrato.
- `IAgentContractBinding.idPrompt`: de onde o LLM tira o id nas ações `getById`/`update`/`softDelete`/`hardDelete`.
- Placeholder `{{TOOLS_TABLE}}` no `systemPromptTemplate`, trocado na geração pela tabela das tools geradas. Os placeholders existentes (`{{ASSISTANT_NAME}}`, `{{CURRENT_DATE}}`, `{{USER_NAME}}`) passam a estar documentados.

### 🔧 Ajustes

- `humanHandoff.contacts[].whatsappPhoneNumber` exige formato E.164 (`+` e de 8 a 15 dígitos).
- `agentIdentity.knowledgeBaseFile` fica opcional (padrão `data/knowledge.md`).
- `businessContext.targetBackendProjectId` fica opcional e documentado como não usado.
- Comentário da lista de tools fixas completo (`mostrar_imagem`, `escalar_para_humano`); nome repetido passa a falhar na geração.

Aditiva, exceto o E.164: `ficharapidaComercial` precisa trocar o telefone provisório.


## 4.0.0

### 💥 Mudanças que quebram

- `IAiAgentConfig.jobs.reminder.cronInterval` e `.timezone` saem. A frequência e o fuso do lembrete passam a ficar em `IBackend.scheduledJobs`, com o id novo `"aiAgentAppointmentReminder"` (por ambiente, como os demais jobs). O `timezone` também é o fuso em que os horários dos agendamentos estão gravados. Migração mecânica: mover os dois valores para uma entrada `{ id: "aiAgentAppointmentReminder", cron, timezone }` em cada `backend[]` do projeto.

### ✨ Novidades

- `jobs.reminder.recipients` (`TAppointmentReminderRecipient[]`): quem recebe o lembrete, `"client"` (quem agendou) e/ou `"professional"` (o profissional do agendamento). Padrão: os dois.
- `jobs.reminder.whatsappTemplates` (`IWhatsappMessageTemplate`): modelo aprovado na Meta por destinatário, com a ordem dos parâmetros documentada. Fora da janela de 24 h a Meta só entrega modelo aprovado.

Requer o `rapida-code-generator` com o lembrete lendo `scheduledJobs`.


## 3.7.0

### ✨ Novidades

- `IProject.geminiIntegration` (`service: "chat"`): chave do Gemini para o agente de IA com `aiProvider: "gemini"`. Antes não havia campo e o `GEMINI_API_KEY` do `.env` gerado saía sempre vazio.

### 📝 Documentação

- `IAiAgentConfig`: o agente exige um módulo que exponha `/whatsapp-chat-histories` (histórico de conversa); de onde vem a chave do provedor; modelos conhecidos por provedor; áudio sem chave de transcrição fica desligado.

Aditiva: nenhum projeto precisa migrar.


## 3.6.1

### 🐛 Correções

- `getStoreOrdersModule`: a unicidade de `storeOrderId` por workspace passa do contrato público para o contrato interno do form, que é de onde o gerador cria o índice único. Na 3.6.0 o índice não era criado, e a loja podia gravar o mesmo pedido duas vezes.

## 3.6.0

Contratos do Grupo B da evolução do skeleton ecommerce/marketplace (itens L07, L08, L13 e L15). Todas as mudanças são aditivas: nenhum projeto existente precisa mudar. O comportamento novo depende de suporte no `rapida-code-generator`.

### ✨ Novidades

- **Agregação em contrato público** (`IPublicContract.aggregations`, nova interface `IContractAggregation`): somas agrupadas por um campo (`groupBy` + `sum`), calculadas no banco e expostas com o mesmo `access` do contrato em `GET <endpoint>/aggregations/<id>`. A resposta é `{ _id, <campo>: <total> }[]`.
- **Saldo de estoque somado no vendedor** (L13): `IMarketplace.stockInAggregateEndpoint` e `stockOutAggregateEndpoint` apontam para agregações das entradas e saídas agrupadas por `productId`. Com elas, a loja deixa de ler todas as movimentações.
- **Pedidos enviados ao vendedor** (L07): módulo pronto `getStoreOrdersModule` (`src/modules/store-orders`), com lista e formulário "Pedidos da loja" no Backoffice do vendedor. O contrato público `storeOrdersFromStore` (create, get, update; `trustedCallers` por padrão, um pedido por `storeOrderId`) recebe o pedido da loja. O vendedor atualiza andamento (`TStoreOrderFulfillmentStatus`: recebido, em separação, enviado, entregue, cancelado) e rastreio. Tipo `IStoreOrder` com os campos do form. A loja aponta para ele em `IMarketplace.storeOrdersEndpoint`.
- **Frete por faixa de CEP** (L08): `TStoreFeature` ganha `"shipping"`. `IStoreSettings` ganha `originZipCode`, `freeShippingAbove`, `shippingRanges` (nova interface `IStoreShippingRange`: faixa de CEP inclusiva, valor e prazo em dias úteis) e o liga e desliga `shippingEnabled`. O módulo `getStoreSettingsModule` mostra esses campos quando recebe `"shipping"` em `features`.
- **Categorias, marcas e ficha técnica** (L15): `IMarketplace.categoriesEndpoint` e `brandsEndpoint`, e `IMarketplace.productFieldMap` (nova interface `IMarketplaceProductFieldMap`), que diz em que campo do produto do vendedor estão categoria, marca, tags, modelo, peso, medidas e propriedades. O formulário de categoria (com hierarquia) fica em `rapida-projects`.

## 3.5.0

### ✨ Novidades

- `IReferralCuration.search` (nova interface `IReferralSearch`): o que buscar nas fontes — `keywords` (ao menos um termo), `categories` com os ids nativos de categoria por fonte e `maxListingsPerQuery`. Substitui a variável `REFERRAL_SEED_KEYWORDS` do `.env` gerado.
- Regra para dado ausente na fonte (tipos `TReferralCriterion`, `TReferralMissingDataPolicy`):
  - `IReferralCuration.missingData`: por critério (`ratingCount`, `rating`, `freeShipping`), `"reject"` ou `"skip"`. Padrão `"reject"`, igual ao comportamento anterior.
  - `IReferralCuration.sourceOverrides`: exceção por fonte, que prevalece nos critérios listados (ex.: tolerar frete desconhecido só na Shopee).
- `IReferralSourceIntegration.defaultDeliveryDays`: prazo assumido para os anúncios da fonte, já que nenhuma API de afiliado informa prazo por item. Sem ele, a fonte perde o desempate `fastestDelivery`.
- `project.schema.json` exige `referralCuration` e ao menos uma fonte em cada `backend[].referralSources` quando `skeleton` é `"referralCommerce"`. Antes o erro só aparecia no gerador.

### 💥 Mudanças que quebram (sem projeto afetado hoje)

- `IReferralCuration.search` é obrigatório.
- `IReferralSourceIntegration` vira união discriminada por `source` (`IShopeeReferralIntegration`, `IAmazonReferralIntegration`, `IMercadoLivreReferralIntegration`), com as chaves de `credentials` de cada programa: Shopee `appId`/`secret`; Amazon `credentialId`/`credentialSecret` e, opcionais, `version`/`marketplace`; Mercado Livre `clientId`/`clientSecret` e, opcional, `mattTool`. Chave desconhecida é rejeitada.
- `affiliateTag` fica opcional na Shopee: a API já devolve o link atribuído à conta dona do AppID. Hoje o gerador não usa o valor; o uso como sub-id depende de confirmar a API com conta real.
- `IScheduledJob.id` passa a ser `TScheduledJobId` (hoje só `"referralPriceSnapshot"`): id digitado errado é rejeitado em vez de cair na frequência padrão sem aviso.
- `IReferralPriceBaseline.minSnapshots` conta dias distintos com captura, não capturas, e a média exclui o dia corrente.

Nenhum projeto em `rapida-projects` usa o skeleton `"referralCommerce"`, então ninguém migra. Requer o `rapida-code-generator` com o suporte a estes campos.

## 3.4.0

### ✨ Novidades

- `skeleton` aceita `"referralCommerce"`: vitrine sem venda própria, com a mesma cara da loja. Cada produto leva, por link de afiliado, para o anúncio na fonte de origem (Shopee, Amazon ou Mercado Livre), onde a compra acontece.
- `IProject.referralCuration` (nova interface `IReferralCuration`): filtros e desempate dos produtos exibidos.
  - Mínimo de avaliações, nota mínima normalizada em 0..1 (0.9 = 4.5/5 = 9/10) e desconto mínimo sobre o preço médio.
  - Preço médio = histórico do próprio anúncio na mesma fonte (`priceBaseline.kind: "sourceHistory"`, `windowDays`, `minSnapshots`).
  - Só frete grátis (`freeShippingOnly`) e ordem de desempate (`tieBreakers`: `fastestDelivery`, `highestCommission`, `lowestPrice`).
  - O mesmo produto em fontes diferentes é identificado só pelo GTIN/EAN.
- `IBackend.referralSources` (nova interface `IReferralSourceIntegration`, tipo `TReferralSource`): credenciais, tag de afiliado e comissão padrão de cada fonte, por ambiente. `"mercadoLivre"` é o catálogo de afiliados; `"mercadoPago"` continua sendo só gateway de pagamento.
- `IBackend.scheduledJobs` (nova interface `IScheduledJob`): frequência (`cron`, `timezone`) dos jobs que o skeleton gera, por `id`. Primeiro id conhecido: `"referralPriceSnapshot"`, a captura de preços do `referralCommerce`.
- Schemas novos `referral-curation.ref.json`, `referral-source-integration.ref.json` e `scheduled-job.ref.json`, ligados em `project.schema.json` e `backend.ref.json`.

Mudança aditiva: nenhum projeto existente precisa migrar.

Requer o `rapida-code-generator` com a PR kunlatek/rapida-code-generator#66 (suporte ao skeleton `"referralCommerce"`).

## 3.3.0

### ✨ Novidades

- `IModule.menuGroup` (`TTranslatable`): módulos com o mesmo grupo aparecem juntos sob esse cabeçalho no menu lateral.
- `IModule.menuDisplay` e `IProject.menu` (`homeGroup`, `flowsGroup`) para organizar o menu lateral.
- Configuração da loja:
  - `IStoreSettings`: identidade, visual (cores em hex, fonte, arredondamento, produtos por página), contato, dados legais, redes, comercial e liga e desliga (`<feature>Enabled`) das funcionalidades opcionais;
  - `IProject.store`: funcionalidades geradas (`features`) e valores iniciais (`defaults`), com `project-store.ref.json` e `store-settings.ref.json`;
  - `IMarketplace.storeSettingsEndpoint`: de onde a loja lê a configuração salva no backoffice do vendedor;
  - `src/modules/store-settings`: primeiro módulo pronto exportado pelo partner (`getStoreSettingsModule`), com contrato `create`, `get` e `update`.
- `IForm.isSingleRecord`: cadastro de registro único por workspace. A tela lê pelo `get`, cria no primeiro salvamento e atualiza depois, sem listagem, sem "novo" e sem endpoint de upsert.
- `EDataType.COLOR` documentado como `"#RRGGBB"`.

### 🐛 Correções

- `form-input.ref.json`: `defaultValue` aceita boolean, como a interface já dizia.

## 3.2.0

### ✨ Novidades

- `skeleton` aceita `"ecommerce"`: loja de um único vendedor, o dono dos dados da instância. `"marketplace"` fica reservado para vários vendedores; até a camada multivendedor existir, o `rapida-code-generator` gera o mesmo núcleo de loja para os dois.
- `IBackend.marketplace` ganha:
  - `sellerWorkspaceId`: a loja só lê produtos, preços e estoque desse workspace;
  - `sellerServiceAuth` (`issuer`, `audience`, `privateKey`, `keyId`): identidade da loja como chamador confiável do vendedor (RFC 7523), para gravar a saída de estoque das vendas aprovadas;
  - `stockOutDefaults`: campos fixos dessa saída de estoque (ex.: `responsibleId` da pessoa padrão do ambiente).
- Nova interface `ISellerServiceAuth`. Schemas `project.schema.json` e `backend.ref.json` atualizados.

Mudança aditiva: nenhum projeto existente precisa migrar.

## 3.1.0

### ✨ Novidades

- `IBackend.marketplace` aceita `productSellingSettingsEndpoint` (opcional): endpoint, na mesma base de `productBaseUrl`, das configurações de venda dos produtos (`productId`, `price`, `isActive`). Com ele, o `rapida-code-generator` passa a mostrar o preço de venda real na vitrine e a calcular o valor do pedido no backend, sem confiar no preço enviado pelo navegador. Sem ele, continua usando `product.price`. Schema `backend.ref.json` atualizado.

Mudança aditiva: nenhum projeto existente precisa migrar.

## 3.0.0

### 💥 Mudança incompatível

- `apiRequest` passa a ser uma **lista** de `IApiRequest` em `IFormInput` (`apiRequest`) e em `IFormButton` (`apiRequest` e `modal.actionButtonApiRequest`). Cada item mantém o formato do objeto de antes, e a ordem da lista é a ordem das chamadas: a seguinte só é tentada se a anterior falhar ou não preencher nenhum campo (chamada reserva). Ex.: CNPJ pela BrasilAPI e, se ela falhar, por outra fonte.
- Schemas `form-input.ref.json` e `form-button.ref.json` exigem array com pelo menos um item. `dataSource` de listas, cards, gráficos, tabelas, grids e kanban continua sendo um único `IApiRequest`.

**Migração:** envolva cada `apiRequest: { ... }` em colchetes, `apiRequest: [{ ... }]`, e o mesmo para `actionButtonApiRequest`.

## 2.4.0

### ✨ Novidades

- `backendComplementaryCode` e `frontendComplementaryCode` de `IBusinessRule` (na regra e nas subregras) aceitam `files`: arquivos novos (`{ path, content }`) que o `rapida-code-generator` cria no projeto gerado quando o `framework` bate com o ativo — por exemplo, testes unitários e fixtures de um motor de regras. `path` é relativo à raiz do projeto gerado, sem `..` e sem caminho absoluto, e a geração falha se o arquivo já existir. Nova interface `IComplementaryFile`; schema `business-rules.ref.json` atualizado.

Mudança aditiva: nenhum projeto existente precisa migrar.

## 2.3.0

### ✨ Novidades

- `backendComplementaryCode` e `frontendComplementaryCode` de `IBusinessRule` (na regra e nas subregras) aceitam `dependencies` e `devDependencies`: pacotes npm que o código complementar usa, no formato nome -> versão exata (ex.: `{ exceljs: "4.4.0" }`). O `rapida-code-generator` soma esses pacotes ao `package.json` do lado correspondente quando o `framework` bate com o ativo. Se o pacote já existir no template com outra versão, mantém a do template e avisa. Schema `business-rules.ref.json` atualizado, só com versões exatas (`1.2.3` ou `1.2.3-beta.1`).

Mudança aditiva: nenhum projeto existente precisa migrar.

## 2.2.0

### ✨ Novidades

- **i18n**: novos tipos `TLanguage` (`"pt-BR" | "en-US" | "es-ES"`) e `TTranslatable` (`string | Partial<Record<TLanguage, string>>`). `IProject.languages` e `IProject.defaultLanguage` (opcionais) declaram os idiomas do projeto. Schemas `language.ref.json` e `translatable.ref.json` adicionados.
- Passam a aceitar `TTranslatable`:
  - `IForm`: `title`/`subtitle`, `label`/`placeholder`/`tooltip` dos elements, `title` de fieldset e de tab.
  - Opções: `label` de `ISelectOption`, `IRadioOption` (radio e radiogroup) e `ICheckboxOption`.
  - `IList`: `title`, `listItems[].label`, `callsToActionMenu[].label` e `callsToActionMenu[].action.request.dialog.{title,message}`.
  - `IModule.title`.
  - `IDataChart`: `title`, `datasets[].label`, `options.plugins.title.text` e `options.scales.{x,y}.title.text`.

### 🐛 Correções

- `storageConfig` do input `WYSIWYG` agora é validado pelo schema (`storage-config.ref.json`, extraído do `form-file` e reutilizado no `form-input`).

Mudança aditiva para quem escreve projetos: `string` continua válida e é tratada como texto no idioma padrão, então nenhum projeto existente precisa migrar. Quem **lê** esses campos (ex.: `rapida-code-generator`) precisa tratar também o mapa por idioma.

## 2.1.0

### ✨ Novidades

- `IFormFile.isProfilePicture` (opcional): marca qual elemento `file` de um form de perfil (`flows.profiles.personProfile`/`companyProfile`) é a foto do usuário. Faz sentido no máximo um por form, e nunca dentro de um `array`. O `rapida-code-generator` usa a flag para exibir a foto no menu do usuário da barra superior. Schema `form-file.ref.json` atualizado.

Mudança aditiva: nenhum projeto existente precisa migrar.

## 2.0.0

Primeira versão publicada desde a 1.19.1 (08/03/2026, commit `27d5b91`). Reúne tudo o que entrou em `main` desde então.

### 💥 Mudanças incompatíveis

Projetos (`IProject`) escritos para a 1.x precisam migrar estes pontos:

- **`IProject.frontend` e `IProject.backend` viraram arrays** (`IFrontend[]`, `IBackend[]`), um item por ambiente. `IFrontend` passou a exigir `environment`, `baseUrl`, `apiBaseUrl` e `isActiveEnvironment`.
- **`flows.invitation`** deixou de ser `boolean` e passou a ser `{ mainUserEmail: string }`.
- **`IPublicContract.permissionedUrls` foi removido.** Agora `access: "anonymous" | "trustedCallers"` é obrigatório. `allowedOrigins` (CORS) é opcional. Chamadores confiáveis são declarados em `IBackend.trustedCallers` (`ITrustedCaller`, JWT de serviço, RFC 7523).
- **`IFormInput.maskRegex` virou `mask`** (`string | string[]`).
- **`IFormInput` com `dataType: WYSIWYG` exige `storageConfig`**. O tipo agora é uma union discriminada.
- **`IStyle` foi reduzido** ao subconjunto que o gerador consome: `themeName`, `colors` (7 campos) e `borders.borderRadius` (antes `radius`), mais `typography` e `shadows`. `src/schemas/project-style-theme.ref.json` foi removido.
- **`IDataChart` foi reestruturado** em interfaces modulares (ver `src/interfaces/data-chart.interface.ts`).
- **`IList.actions[].action.link`** agora é opcional e ganhou o irmão `linkAfterAction`.
- **`index.ts` virou CLI**: `bun index.ts <projeto.ts> [saida.json]`. A dependência de `.env` foi removida, e `src/utils/env.ts` e `env.example` também.

### ✨ Novidades

- `EDataType.CURRENCY` (`"currency"`): valor monetário guardado como decimal (2 casas) e exibido como moeda.
- Componente **kanban** (`IKanban`, `kanban.ref.json`), com `relatedFormId`.
- Elementos de form **checkbox**, **radio** e **switch**. `IForm.subtitle`, `IFormArray.tooltip`, `ISelectOption` exportado.
- **Paginação** em listas (`IList.pagination`). Colunas de `IDataTable` com tipo e formatação.
- Relação **`many-to-one`** em foreign keys de contratos.
- **Notificações e lembretes**: `IProject.notifications` (`INotification`, com `recipients`) e `IForm.reminders` (`IRecordReminder`).
- **Agente de IA**: `skeleton: "aiAgent"` e `"service"`, `IProject.aiAgentConfig` (`IAiAgentConfig`), chave OpenAI com serviço `transcription`, usuário do bot, limites de áudio e `humanHandoff` (escalada com resumo via WhatsApp).
- Integrações `deepseekIntegration`, `openaiIntegration` e `mongodbIntegration`, além de suporte a SQLite e a configuração de WhatsApp no backend.
- `IProject.repositories` (`IProjectRepositories`): repositórios git de destino do código gerado.
- `flows.registrationMethod` e `flows.resetPasswordMethod` (`"link" | "code"`).
- `IFrontend.logoPath`, `faviconPath` e `isSsr`.
- `IPaymentGateway` exportado.
- Novos schemas `.ref.json` para tudo o que está acima, e correção de lacunas antigas de validação. Por exemplo, a chave `"publicContracts?"` em `list`/`kanban.ref.json` nunca era validada.

### 📦 Empacotamento

- O pacote não publica mais `src/constants/`. Até a 1.19.1, esse diretório (ignorado no git, mas coberto por `"files": ["src/"]`) ia junto no tarball.
- O pacote não publica mais `rapidaObject.json`. Ele é a saída local da CLI, montada a partir de qualquer projeto, e podia conter segredos desse projeto.
- Consequência: `src/examples/projects/movieBackoffice.ts` importa `src/constants/secrets/*` e não compila a partir do pacote. Os demais exemplos (forms, lists, modules) continuam utilizáveis.
