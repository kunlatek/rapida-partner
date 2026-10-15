# Changelog

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
