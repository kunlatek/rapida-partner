# Changelog

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
