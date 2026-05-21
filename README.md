# Projeto Rapida Partner

Este repositório contém a ferramenta `rapida-partner`, que atua como uma ponte entre a idealização de um projeto de software e sua implementação técnica. Seu objetivo principal é traduzir a lógica de negócio e os requisitos de engenharia em um objeto JSON unificado, servindo como um "mapa" detalhado para a criação de qualquer projeto.

O "Movie Backoffice" é apenas um exemplo prático, mostrando como as interfaces do `rapida-partner` podem ser utilizadas para descrever um sistema completo. Ele detalha desde o plano de negócios e as regras de negócio até a estrutura do frontend e backend, além de definir módulos e componentes como formulários e listas.

## Visão Geral do Projeto de Exemplo

O projeto `Movie Backoffice` demonstra o uso do `rapida-partner` para um sistema de gerenciamento de filmes e personagens. Ele foi idealizado para gerenciar e otimizar operações, com um plano de negócios que inclui valor de negócio, mercado-alvo, análise de concorrentes, questões legais, éticas e estratégia de monetização.

A arquitetura técnica é definida da seguinte forma:

- **Frontend**: Angular com Flowbite UI Kit.
- **Backend**: NestJS com banco de dados MongoDB.
- **Fluxos**: Autenticação, permissão, registro e perfis (pessoa/empresa).
- **Módulos**: `movieModule`, `actorModule`, `characterModule` e `productModule`.

## Como Usar o `rapida-partner`

### 1. Instalação

Este projeto utiliza **Bun** como runtime e gerenciador de pacotes.

```bash
git clone [URL_DO_REPOSITORIO]
cd rapida-partner
bun install
```

### 2. Geração do Mapa do Projeto (JSON)

O `rapida-partner` agora funciona como uma **CLI (Interface de Linha de Comando)**. Você informa o caminho do arquivo TypeScript que descreve o projeto, e a ferramenta gera o JSON correspondente.

**Sintaxe:**

```bash

bun index.ts <caminho-para-arquivo-do-projeto> [caminho-para-json-de-saída]
```

**Exemplo com o projeto de exemplo:**

```bash

bun index.ts ./src/examples/projects/movieBackoffice.ts ./rapidaObject.json
```

- O primeiro argumento é **obrigatório** e deve apontar para um arquivo TypeScript que exporte (`export default` ou `export const`) um objeto que implemente a interface `IProject`.
    
- O segundo argumento é **opcional** e define onde o JSON gerado será salvo. Se omitido, o arquivo será criado como `./rapidaObject.json`.
    

### 3. Validação Automática

Após gerar o JSON, o script automaticamente valida o conteúdo contra o esquema `project.schema.json` e todas as suas referências (arquivos `.ref.json`). Se a validação falhar, os erros são exibidos no console, permitindo que você corrija as inconsistências.

### 4. Estrutura do Projeto (Interfaces)

Para criar seu próprio "mapa", utilize as interfaces TypeScript disponíveis na pasta `src/interfaces/`. Elas definem cada componente e regra de negócio que você pode descrever.

- `project.interface.ts`: Define a estrutura de um projeto, incluindo plano de negócios, regras de negócio, módulos e dashboard.
    
- `project-backend.interface.ts`: Detalha as configurações de backend (framework, banco de dados, armazenamento, logging, email, marketplace, etc.).
    
- `form.interface.ts`, `list.interface.ts`, `data-table.interface.ts`, `data-chart.interface.ts`, etc.: Definem os tipos de componentes de UI e suas propriedades (campos de formulário, listas, tabelas, gráficos, etc.).
    

### 5. Como Funciona a Validação

A validação é feita através do módulo `src/utils/json.ts`, que utiliza as bibliotecas `ajv` e `ajv-formats`. O processo:

1. Carrega o esquema principal (`project.schema.json`).
    
2. Coleta recursivamente todas as referências (`$ref`) e adiciona os esquemas correspondentes.
    
3. Compila o validador e verifica o JSON gerado.
    
4. Exibe os erros de validação caso o projeto não esteja em conformidade.
    

## Problemas Conhecidos

- No atributo `contracts[n].request.fields[n]`, se o `dataType` for `"array"`, é necessário inserir um campo `elements` para descrever melhor a estrutura do array no contrato.
    

## Remoção da Dependência do `.env`

Diferentemente de versões anteriores, o `rapida-partner` **não requer mais** um arquivo `.env` para funcionar. As variáveis de ambiente (como `ROOT_PATH`) foram substituídas por caminhos calculados dinamicamente a partir do diretório do pacote. Portanto, não há necessidade de configurar nenhuma variável externa.

## Licença
Este projeto está licenciado sob os termos da licença MIT.
```text
MIT License

Copyright (c) [ano] [seu nome]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contribuição

Contribuições são bem-vindas. Abra uma issue ou pull request para sugestões e melhorias.
