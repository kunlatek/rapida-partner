# Projeto Rapida Partner

Este repositório não é um sistema de gerenciamento de filmes e personagens por si só, mas sim a ferramenta `rapida-partner`, que atua como uma ponte entre a idealização de um projeto de software e sua implementação técnica. Seu objetivo principal é traduzir a lógica de negócio e os requisitos de engenharia em um objeto JSON unificado, servindo como um "mapa" detalhado para a criação de qualquer projeto.

O "Movie Backoffice" é apenas um exemplo prático, mostrando como as interfaces do `rapida-partner` podem ser utilizadas para descrever um sistema completo. Ele detalha desde o plano de negócios e as regras de negócio até a estrutura do frontend e backend, além de definir módulos e componentes como formulários e listas.

## Visão Geral do Projeto de Exemplo

O projeto `Movie Backoffice` demonstra o uso do `rapida-partner` para um sistema de gerenciamento de filmes e personagens. Ele foi idealizado para gerenciar e otimizar operações, com um plano de negócios que inclui valor de negócio, mercado-alvo, análise de concorrentes, questões legais, éticas e estratégia de monetização.

A arquitetura técnica é definida da seguinte forma:

- **Frontend**: Svelte com Flowbite UI Kit.
    
- **Backend**: NestJS com banco de dados MongoDB.
    
- **Fluxo de Autenticação**: `permeson`.
    
- **Módulos**: `personModule`, `companyModule`, `movieModule`, e `characterModule`.
    

## Como Usar o `rapida-partner`

### 1. Instalação e Configuração

Este projeto utiliza **Bun** como runtime e gerenciador de pacotes.

1. **Clone o repositório:**
   
```bash
git clone [URL_DO_REPOSITORIO]
cd rapida-partner
```
    
1. **Instale as dependências:**
```bash
bun install
```

3. **Variáveis de Ambiente:** Crie um arquivo `.env` a partir do `env.example` para configurar variáveis sensíveis.
```
ROOT_PATH=/path/to/rapida-partner
TERMINAL_PASSWORD=t3rm1n4lP455w0rd
```
    
    As configurações de backend, como `database`, `storage`, `logging` e `email`, são definidas diretamente no objeto do projeto TypeScript (`movieBackoffice.ts`).
    

### 2. Gerando o Mapa do Projeto (JSON)

O coração do `rapida-partner` é a capacidade de converter uma representação de projeto em TypeScript para um arquivo JSON. Isso é feito pelo script `index.ts`.

Para gerar o `rapidaObject.json` a partir do `movieBackoffice.ts`, execute:

```bash
bun run index.ts
```

Este comando executa a função `tsProjectToJsonProject`, que serializa o objeto `movieBackoffice` para JSON e salva o resultado no arquivo `rapidaObject.json`. Em seguida, o arquivo JSON é validado contra o esquema `project.schema.json` para garantir que a estrutura está correta.

### 3. Entendendo as Interfaces

Para criar seu próprio "mapa" de projeto, você deve se basear nas interfaces TypeScript disponíveis na pasta `src/interfaces/`. Elas definem a estrutura de cada componente e regra de negócio que você pode descrever.

- `project.interface.ts`: Define a estrutura de um projeto, incluindo plano de negócios, regras de negócio e módulos.
    
- `project-backend.interface.ts`: Detalha as configurações de backend (framework, banco de dados, armazenamento, etc.).
    
- `form.interface.ts`, `list.interface.ts`, `data-table.interface.ts`, etc.: Definem os tipos de componentes de UI e suas propriedades, como campos de formulário, listas de dados e tabelas.
    

Ao criar um novo objeto de projeto, importe e utilize essas interfaces para garantir a conformidade com a estrutura esperada pelo sistema de validação.

### 4. Como o "Mapa" é Validado

A validação do objeto JSON é crucial para garantir a integridade do projeto. O script `index.ts` usa o utilitário `validateProjectJson` para isso.

- Ele carrega o esquema JSON (`project.schema.json`) e todos os esquemas de referência (`.ref.json`).
    
- Em seguida, ele compila e valida o `rapidaObject.json` em relação a esse esquema.
    
- Se a validação falhar, os erros são exibidos no console, permitindo que você identifique e corrija rapidamente as inconsistências.
    

Essa abordagem garante que a descrição do projeto é tecnicamente sólida e coerente, facilitando a próxima etapa do processo de desenvolvimento.