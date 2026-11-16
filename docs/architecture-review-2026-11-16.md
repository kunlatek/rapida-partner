# Revisão de arquitetura — rapida-partner (2026-11-16)

> **Recorte desta rodada:** em vez de varrer a DSL inteira de novo, a revisão avalia o que a DSL precisa ter para suportar um novo `skeleton: "referralCommerce"` — loja de vitrine com a mesma cara do `ecommerce`/`marketplace` atual, que não vende: cada produto leva por link de afiliado para a fonte "sorteada" (Shopee, Amazon ou "Mercado Pago" — ver achado N1), e o backend gerado busca e filtra produtos dessas fontes.
>
> Requisitos de entrada (do pedido):
> 1. Frontend igual ao da loja atual; a compra segue no fluxo da fonte escolhida.
> 2. Backend com API de busca de produtos nas três fontes, filtrando por:
>    - mais de 200 avaliações;
>    - nota >= 9/10 **ou** >= 4.5/5;
>    - preço pelo menos 10% abaixo da média do produto;
>    - frete grátis;
>    - empate entre fontes → a que entrega mais rápido; empate também no prazo → a que paga a maior comissão.
>
> Fontes confirmadas: Shopee, Amazon e **Mercado Livre** (ver N1).
>
> Achados das revisões anteriores (`architecture-review-2026-08-14.md`, `architecture-review-2026-08-20.md`) não são repetidos aqui. O único que toca no assunto é o do `IPaymentGateway`/checkout, e ele não aparece nas rodadas anteriores.

## Resumo

| Severidade | Quantidade |
|---|---|
| Alta | 3 |
| Média | 5 |
| Baixa | 3 |
| **Total** | **11** |

| Categoria | Achados |
|---|---|
| Cobertura de skeleton | S1, S2, S3, S4 |
| Estrutura module/component/element | E1, E2, E3 |
| Tipagem | T1, T2 |
| Nomenclatura | N1, N2 |

- **Com evidência real no código** (o problema já existe hoje em `rapida-partner`/`rapida-code-generator`/`rapida-projects` e o novo skeleton bateria nele): S1, S2, S3, S4, N1, N2, E3 → **7**.
- **Prospectivos/teóricos** (decorrem dos requisitos novos, sem uso divergente ainda): E1, E2, T1, T2 → **4**.

> ✅ **Todas as decisões bloqueantes foram tomadas em 2026-11-16.**
>
> ✅ **Decidido em 2026-11-16:** E1 — "o mesmo produto" entre fontes é definido **só por GTIN/EAN**; anúncio sem EAN concorre sozinho.
>
> ✅ **Decidido em 2026-11-16:** E2 — o "preço médio" é o **histórico do próprio anúncio** na mesma fonte (`priceBaseline.kind: "sourceHistory"`), o que exige coleção de snapshots de preço e job agendado.
>
> ✅ **Decidido em 2026-11-16:** N1 — a terceira fonte é o **Mercado Livre** (`"mercadoLivre"` em `TReferralSource`); "Mercado Pago" no pedido original era engano.

---

## Achados

### [Cobertura de skeleton] S1 — "Loja" é um bloco indivisível no gerador: vitrine e transação saem juntas, e `referralCommerce` só quer a vitrine
- **Severidade**: alta
- **Arquivo(s)**: `src/interfaces/project.interface.ts:27-30`, `src/interfaces/project-backend.interface.ts` (`IMarketplace`)
- **Achado**: hoje, ser loja significa receber de uma vez vitrine (layout, página de produtos, card) e transação (carrinho, estoque, pedidos, endereços, checkout, e2e de pedidos). Tudo é decidido por um único predicado `isStoreSkeleton(project)`, sem nenhuma separação entre as duas camadas. Para `referralCommerce` a vitrine é a mesma, mas carrinho, estoque, pedidos, endereços e checkout não devem existir. A ação do card deixa de ser "adicionar ao carrinho" e passa a ser "abrir link de afiliado".
- **Evidência de uso real**:
  - `rapida-code-generator/src/core/store-skeleton.ts:3-4` — `isStoreSkeleton = skeleton === "ecommerce" || skeleton === "marketplace"`.
  - `rapida-code-generator/src/frontend/angular/ui/flowbite/skeletons/skeleton.generator.ts:34-45` — o mesmo `case` empurra o layout e a página **e também** cart service, cart storage, cart sidebar e stock service.
  - `rapida-code-generator/src/backend/nest/processors/features.processor.ts:265` (módulo de endereços), `src/frontend/angular/index.ts:72` (checkout/pagamento), `src/e2e/playwright/playwright.ts:66` (specs de pedidos) — todos usam o mesmo predicado.
  - `.../marketplace/marketplace-product-card.component.template.ts:106,122` — o card só tem o `addToCart` como ação.
- **Impacto**: se `referralCommerce` entrar em `isStoreSkeleton`, gera carrinho, pedidos e checkout que não servem. Se não entrar, perde layout, página, card e configurações da loja, e alguém vai copiar os templates (drift garantido).
- **Mudança sugerida**:
  - **No partner (aditiva):** acrescentar `"referralCommerce"` à union de `IProject.skeleton`, com comentário no mesmo padrão do `ecommerce`/`marketplace`: *"vitrine sem venda própria; cada produto leva por link de afiliado para a fonte de origem"*.
  - **No gerador (item para `rapida-code-generator-angular-nest-playwright-execution`, não para esta skill):** separar o predicado em dois, `isStorefrontSkeleton` (ecommerce, marketplace, referralCommerce) e `isTransactionalStoreSkeleton` (ecommerce, marketplace). A ação do card passa a ser parametrizada (`addToCart` | `openReferral`).
- **Risco de quebra**: aditiva no partner. No gerador a refatoração é interna; nenhum projeto existente muda de comportamento, desde que os dois `ecommerce` continuem caindo no predicado transacional.

### [Cobertura de skeleton] S2 — `IBackend.marketplace` (`IMarketplace`) é obrigatoriamente transacional e não pode ser reaproveitado para fontes de afiliado
- **Severidade**: alta
- **Arquivo(s)**: `src/interfaces/project-backend.interface.ts` (`IMarketplace`, `IPaymentGateway`)
- **Achado**: `IMarketplace` tem como **obrigatórios** `paymentGateways`, `productsAutocomplete`, `stockInEndpoint`, `stockOutEndpoint` e `productBaseUrl`. Todos pressupõem um vendedor com produtos próprios e um backoffice de estoque. No `referralCommerce` os produtos vêm de APIs externas de afiliado, sem estoque, vendedor nem gateway. Reaproveitar `marketplace` exigiria preencher esses campos com valores falsos.
- **Evidência de uso real**: `rapida-projects/src/projects/marketplace/movie/movieStore.ts` (bloco `marketplace:`) preenche todos esses campos apontando para o `movieBackoffice`. O gerador lê `productBaseUrl` e o cliente do vendedor em `.../flows/marketplace.service.products.builder.ts` (`sellerClient.fetchAll`/`fetchOne`). Não existe outra fonte de produto na DSL.
- **Impacto**: sem um bloco próprio, a tentação é vazar campos de afiliado para dentro de `IMarketplace`, piorando a mistura "loja própria vs. vitrine" que S1 já aponta.
- **Mudança sugerida** (aditiva). Credenciais ficam **por ambiente**, em `IBackend`, como já é com `mercadoPagoIntegration`/`whatsapp`:
  ```ts
  // project-backend.interface.ts
  export type TReferralSource = "shopee" | "amazon" | "mercadoLivre"; // ver N1
  export interface IReferralSourceIntegration {
    source: TReferralSource;
    // Cada fonte tem o seu par de credenciais; os nomes seguem os de cada programa.
    credentials: Record<string, string>;
    // Tag/ID de afiliado anexado aos links gerados.
    affiliateTag: string;
  }
  interface IBackend {
    // ...
    referralSources?: IReferralSourceIntegration[];
  }
  ```
  `credentials: Record<string, string>` é o ponto de partida. O certo é uma união discriminada por `source`, como em T1, assim que os campos reais de cada programa forem confirmados.
- **Risco de quebra**: aditiva.

### [Cobertura de skeleton] S3 — skeleton desconhecido cai em `backoffice` em silêncio no gerador
- **Severidade**: alta
- **Arquivo(s)**: `src/interfaces/project.interface.ts:30` (union), consumida pelo gerador
- **Achado**: o `switch (project.skeleton)` do gerador agrupa `case "backoffice":` com `default:`. A rota raiz em `app-root` só trata `isBackoffice` e `isMarketplace`. Um valor novo na union (como `"referralCommerce"`) passa no type-check do partner e na validação do JSON Schema, e o gerador produz **um backoffice** sem nenhum aviso. Isso já acontece hoje com `socialNetwork`/`service`, que têm entrada na union mas nenhuma implementação de loja/serviço correspondente (ver `rapida-projects-over-requirements`, seção 2.2).
- **Evidência de uso real**:
  - `rapida-code-generator/src/frontend/angular/ui/flowbite/skeletons/skeleton.generator.ts:53-54` (`case "backoffice": default:`).
  - `rapida-code-generator/src/frontend/angular/ui/flowbite/templates/base/app-root.template.ts:39-40,121-126`: se não for backoffice nem loja, a rota raiz fica vazia.
- **Impacto**: no intervalo entre o PR do partner (aditivo) e o do gerador, qualquer `referralCommerce` gera um backoffice que parece ter funcionado.
- **Mudança sugerida**: no gerador, trocar o `default` por um `switch` exaustivo (`const _exhaustive: never = project.skeleton`) e falhar com mensagem clara para skeleton não suportado. No partner, o CHANGELOG da entrada nova deve dizer explicitamente "requer rapida-code-generator >= X".
- **Risco de quebra**: breaking (decisão manual) **só** para quem hoje gera `socialNetwork`. No `rapida-projects` existe 1 projeto `service`: conferir se ele depende do fallback antes de ligar o erro. Para os demais, nenhum impacto.

### [Cobertura de skeleton] S4 — campos condicionais por skeleton são opcionais soltos, amarrados só por comentário
- **Severidade**: média
- **Arquivo(s)**: `src/interfaces/project.interface.ts:79,83-85` (`aiAgentConfig?`, `store?`), `src/interfaces/project-backend.interface.ts` (`marketplace?`, `service?`)
- **Achado**: "só para skeleton X" aparece apenas em comentários. Nada impede `store` num `backoffice` ou `aiAgentConfig` num `ecommerce`, e o `index.ts` não faz validação cruzada: o único check estrutural é `obj.id && obj.title && obj.skeleton`. O `referralCommerce` acrescentaria mais dois opcionais soltos (`IProject.referralCuration`, `IBackend.referralSources`).
- **Evidência de uso real**: `rapida-partner/index.ts:10` (validação mínima); `project.interface.ts:83` (comentário "Só para skeleton ecommerce/marketplace"); grep por `store`/`marketplace`/`aiAgentConfig` em `index.ts` não retorna nada. Nenhum projeto em `rapida-projects` usa os campos no skeleton errado ainda, então o risco é latente.
- **Impacto**: a cada skeleton novo, cresce a superfície de combinações inválidas que só aparecem na geração.
- **Mudança sugerida**:
  - **Curto prazo (aditiva):** uma validação em `index.ts`, ou `if/then` no `project.schema.json`, que avisa quando um bloco condicional aparece com o skeleton errado.
  - **Longo prazo (breaking, decisão manual):** transformar `IProject` numa união discriminada por `skeleton`. Não fazer agora; registrar.
- **Risco de quebra**: aditiva (curto prazo).

### [Estrutura] E1 — "empate em mais de uma fonte" pressupõe identidade de produto entre fontes, que a DSL não modela
- **Severidade**: média
- **Arquivo(s)**: novo (`IProject.referralCuration`, proposto em T1)
- **Achado**: para desempatar Shopee x Amazon x terceira fonte, o backend precisa saber que dois anúncios são **o mesmo produto**. O pedido não diz como.
  - O caminho óbvio é GTIN/EAN. O `MarketplaceProduct` gerado já tem `ean13`/`ean14`, e o `movieStore` busca por `ean13`.
  - Só que APIs de afiliado nem sempre devolvem GTIN: Shopee e Mercado Livre costumam não devolver em todos os itens; confirmar na documentação de cada programa.
  - Sem chave confiável, o "empate" nunca acontece, ou acontece por casamento de título, que é impreciso.
- **Evidência de uso real**: `rapida-code-generator/.../marketplace/marketplace.types.template.ts` (`ean13`, `ean14` em `MarketplaceProduct`); `rapida-projects/.../movieStore.ts` (`labelField: ["name", "ean13"]`). Nenhum uso divergente: achado prospectivo.
- **Impacto**: define se a regra de desempate funciona de verdade ou é decorativa.
- **Decisão (2026-11-16)**: **só GTIN/EAN**. Prioriza precisão: nunca desempata dois produtos diferentes por engano, ao custo de menos desempates.
- **Mudança sugerida**:
  - Sem campo `matchBy` por enquanto: com uma única estratégia, o campo seria configuração sem escolha real. Documentar no JSDoc de `IReferralCuration` que a identidade entre fontes é o GTIN. Se um dia entrar casamento por título, `matchBy` volta como campo opcional, de forma aditiva, com padrão `["gtin"]`.
  - Normalizar o GTIN antes de comparar: só dígitos, EAN-13/EAN-14/UPC-A comparados na forma GTIN-14 (zeros à esquerda) e dígito verificador validado. Código inválido conta como "sem EAN".
  - Anúncio sem EAN (ou com EAN inválido) **não é descartado**: concorre sozinho, como se fosse o único da sua fonte. Vale medir, depois do primeiro projeto no ar, quantos anúncios de cada fonte chegam sem EAN; se a cobertura for baixa, reavaliar o título.
  - O `ean13`/`ean14` do `MarketplaceProduct` gerado continua servindo de campo na vitrine; o gerador preenche a partir do GTIN normalizado.
- **Risco de quebra**: aditiva.

### [Estrutura] E2 — "preço médio do produto" não é dado que as fontes entregam: exige histórico próprio e job agendado, que a DSL não tem fora do `aiAgent`
- **Severidade**: média
- **Arquivo(s)**: novo; referência `src/interfaces/ai-agent.interface.ts:121-126` (`cronInterval`)
- **Achado**: o filtro "preço pelo menos 10% abaixo da média" não diz média **de quê**. Há três leituras possíveis:
  - (a) histórico do mesmo anúncio na mesma fonte, numa janela de N dias. Exige gravar snapshots de preço periodicamente: uma coleção nova mais um job.
  - (b) média entre as fontes para o mesmo produto. Depende de E1.
  - (c) preço "de/por" informado pela própria fonte. Mais barato, mas manipulável pelo vendedor.

  A DSL só tem agendamento dentro de `aiAgentConfig` (`cronInterval`, timezone). Não existe construção genérica de job de backend.
- **Evidência de uso real**: `ai-agent.interface.ts:121-126` é o único `cron` da DSL. Nenhum uso divergente: achado prospectivo.
- **Impacto**: (a) muda a arquitetura (persistência e job). (c) é só leitura de campo. A diferença de esforço é grande.
- **Decisão (2026-11-16)**: leitura **(a), histórico do próprio anúncio**. Cada anúncio é comparado só com o próprio passado na mesma fonte, então E2 não depende mais de E1.
- **Mudança sugerida**:
  - `priceBaseline: { kind: "sourceHistory"; windowDays: number; minSnapshots?: number }` em `referralCuration`. Os outros `kind` saem da proposta inicial e podem entrar depois, de forma aditiva, se aparecer necessidade.
  - `minSnapshots` resolve o arranque a frio: anúncio recém-descoberto não tem média. O comportamento proposto é **não exibir** enquanto não houver snapshots suficientes, porque exibir sem média furaria o filtro de 10%.
  - Definir "média" como média simples dos snapshots na janela (documentar no JSDoc; mediana é alternativa mais resistente a picos promocionais).
  - Persistência: o gerador cria uma coleção de snapshots (`sourceId`, `source`, `price`, `capturedAt`). É estrutura do skeleton, não um `IForm` declarado pelo projeto.
  - Agendamento: em vez de duplicar `cronInterval` do `aiAgentConfig`, propor um bloco genérico em `IBackend`, por exemplo `scheduledJobs?: { id: string; cron: string; timezone?: string }[]`. O skeleton `referralCommerce` registra o job de captura de preços com um id fixo (ex.: `"referralPriceSnapshot"`); o projeto só ajusta a frequência. A frequência pode variar por ambiente; por isso fica em `IBackend`.
  - Ver também T2/termos de uso: a frequência de captura precisa respeitar os limites de requisição de cada API de afiliado.
- **Risco de quebra**: aditiva.

### [Estrutura] E3 — funcionalidades da loja (`TStoreFeature`) não distinguem o que é de vitrine do que é de venda
- **Severidade**: baixa
- **Arquivo(s)**: `src/interfaces/store-settings.interface.ts` (`TStoreFeature`, `IStoreSettings`)
- **Achado**: o `referralCommerce` quer reaproveitar `IProjectStore`/`IStoreSettings` (identidade, cores, fonte, redes, `favorites`, `blog`, `whatsappButton`). Mas `stockAvailability`, `cashDiscount`/`cashDiscountPercent` e `installments`/`maxInstallments` só fazem sentido com venda própria.
- **Evidência de uso real**: `store-settings.interface.ts` (lista de `TStoreFeature`) e o comentário "Só para skeleton ecommerce/marketplace" em `project.interface.ts:83`.
- **Impacto**: baixo. O gerador pode só ignorar essas features no `referralCommerce`. Sem documentação, porém, alguém liga `installments` e espera ver parcelas.
- **Mudança sugerida**: documentar no JSDoc de `TStoreFeature` quais features valem para quais skeletons; opcionalmente, um tipo `TStorefrontFeature` (subconjunto) para o `referralCommerce`. Ampliar o comentário de `IProject.store` para incluir `referralCommerce`.
- **Risco de quebra**: aditiva.

### [Tipagem] T1 — regras de curadoria devem ser dados tipados, não `businessRules` em texto livre, e a nota deve ser normalizada
- **Severidade**: média
- **Arquivo(s)**: novo; referência `src/interfaces/project.interface.ts` (`IBusinessRule`)
- **Achado**: os filtros pedidos (mínimo de avaliações, nota mínima, desconto mínimo, frete grátis, ordem de desempate) são parâmetros numéricos e enumerados. Escritos como `businessRules` (`description: string` + `backendComplementaryCode`), viram código colado por projeto, sem validação. O critério "nota >= 9/10 **ou** >= 4.5/5" é o mesmo limiar em duas escalas: 0,9 normalizado. Até onde sei, as três fontes usam escala de 5 estrelas (confirmar), então o "9/10" provavelmente nunca dispara. Escrever os dois limiares, ligados por OU, na DSL é tipagem frouxa.
- **Evidência de uso real**: nenhuma. Achado prospectivo, mas segue a mesma lógica do `IProjectStore.features` (decisão tipada em vez de texto).
- **Mudança sugerida** (aditiva; regras de produto ficam em `IProject`, não variam por ambiente):
  ```ts
  export type TReferralTieBreaker = "fastestDelivery" | "highestCommission" | "lowestPrice";
  export interface IReferralCuration {
    minRatingCount: number;            // 200 (o pedido diz "mais de 200": documentar se é > ou >=)
    minNormalizedRating: number;       // 0..1; 0.9 ≡ 4.5/5 ≡ 9/10
    minDiscountFromBaseline: number;   // 0..1; 0.1 = 10% abaixo
    priceBaseline: { kind: "sourceHistory"; windowDays: number; minSnapshots?: number }; // ver E2 (decidido)
    freeShippingOnly: boolean;
    // Identidade entre fontes: só GTIN/EAN normalizado (ver E1, decidido); sem campo de configuração.
    tieBreakers: TReferralTieBreaker[];                          // ["fastestDelivery", "highestCommission"]
  }
  // IProject
  referralCuration?: IReferralCuration; // só para skeleton "referralCommerce"
  ```
- **Risco de quebra**: aditiva.

### [Tipagem] T2 — desempates dependem de dados que nem toda fonte devolve (prazo, comissão por item)
- **Severidade**: baixa
- **Arquivo(s)**: novo (`TReferralTieBreaker`)
- **Achado**: "entrega mais rápida" e "melhor comissão" só desempatam se as três fontes informarem esses valores por item. Pelo que se sabe das APIs de afiliado (confirmar antes de implementar):
  - a Shopee expõe taxa de comissão por oferta;
  - a Amazon trabalha com tabela de comissão por categoria, não por item;
  - prazo de entrega costuma depender de CEP e nem sempre vem na busca.

  Sem definir o que fazer quando o dado falta, a ordenação fica indefinida.
- **Evidência de uso real**: nenhuma. Prospectivo.
- **Mudança sugerida**: documentar em `TReferralTieBreaker` que dado ausente perde o desempate (ou é pulado), e permitir `commissionOverrides?: Partial<Record<TReferralSource, number>>` em `IReferralSourceIntegration`, para declarar taxas de tabela quando a API não informa.
- **Risco de quebra**: aditiva.

### [Nomenclatura] N1 — "Mercado Pago" como fonte de produtos colide com `mercadoPago` gateway; programa de afiliados/catálogo é do Mercado Livre
- **Severidade**: alta
- **Arquivo(s)**: `src/interfaces/project-backend.interface.ts` (`IPaymentGateway.provider: "mercadoPago"`, `IBackend.mercadoPagoIntegration`)
- **Achado**: na DSL, `mercadoPago` já significa **gateway de pagamento**: provider de `IPaymentGateway` e o bloco `mercadoPagoIntegration`, com usuários de teste comprador/vendedor. O pedido lista "mercado pago" como fonte de busca de produtos com link de afiliado. Busca de produtos e afiliados são do **Mercado Livre**; o Mercado Pago não tem catálogo. Se `TReferralSource` incluir `"mercadoPago"`, o mesmo literal passa a ter dois sentidos na DSL (dimensão 3.1).
- **Evidência de uso real**: `rapida-projects/src/projects/marketplace/movie/movieStore.ts` (`paymentGateways: [{ provider: "mercadoPago" }]` + `mercadoPagoIntegration`), o mesmo padrão no `sugestoStore`; `CHANGELOG.md` do partner.
- **Impacto**: ambiguidade semântica direta, e possivelmente um requisito trocado.
- **Mudança sugerida**: usar `"mercadoLivre"` em `TReferralSource`. `mercadoPago` continua significando só gateway de pagamento.
- **Decisão (2026-11-16)**: confirmado pelo dono do pedido que a fonte é o **Mercado Livre**. O achado fica resolvido no desenho; resta só aplicá-lo junto com S2/T1.
- **Risco de quebra**: aditiva (enum novo).

### [Nomenclatura] N2 — nome do skeleton e pasta de projetos: `referralCommerce` não segue nem `ecommerce` nem o padrão de pasta atual
- **Severidade**: baixa
- **Arquivo(s)**: `src/interfaces/project.interface.ts:30`, `src/schemas/project.schema.json:15-25`
- **Achado**: há dois pontos.
  - A union e o JSON Schema duplicam a lista de skeletons. Hoje estão em sincronia, mas um valor novo exige editar os dois.
  - Os projetos `ecommerce` já moram em `rapida-projects/src/projects/marketplace/...`, não em `.../ecommerce/`, e a convenção da skill `rapida-projects-over-requirements` (2.1) diz `src/projects/<skeleton>/`. Um terceiro skeleton de loja aumenta essa divergência.

  Quanto ao nome, `referralCommerce` é claro e está em camelCase como os demais. Alternativa mais curta e comum no mercado: `affiliateStore`. Escolha estética, mas convém decidir antes de existir o primeiro projeto.
- **Evidência de uso real**: `rapida-projects/src/projects/marketplace/movie/movieStore.ts` e `.../jedd/administradoClient.ts` têm `skeleton: "ecommerce"` dentro de `marketplace/`; `project.interface.ts:30` x `project.schema.json:17-24`.
- **Mudança sugerida**: um teste no partner (ou geração do schema a partir do TS) que garante a igualdade entre union e enum do schema; decidir e registrar se lojas ficam todas em `projects/marketplace/` ou por skeleton.
- **Risco de quebra**: aditiva.

---

## Ordem sugerida de implementação (N1, E1 e E2 decididos — pronto para virar trabalho)

1. Partner: `"referralCommerce"` na union e no schema (N2), `IReferralCuration` + `IBackend.referralSources` (S2, T1, T2) e `IBackend.scheduledJobs` (E2), tudo aditivo, com CHANGELOG avisando da versão mínima do gerador (S3).
2. Gerador: switch exaustivo (S3) → separar vitrine/transação (S1) → card com `openReferral` → módulo Nest de busca por fonte → coleção de snapshots + job de captura de preços (E2) → curadoria e desempate.
3. Projeto de referência em `rapida-projects` (o primeiro `referralCommerce`), para o skeleton não virar mais um `socialNetwork` sem precedente.
4. Fora da DSL, mas obrigatório antes de ir ao ar: conferir os termos de cada programa de afiliado (aviso de link de afiliado na página, limites de cache de preço e de exibição) e quem é o titular das contas de afiliado.
