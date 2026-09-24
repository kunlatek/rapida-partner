/**
 * Backend externo autorizado a chamar os `publicContracts` com `access: "trustedCallers"`.
 *
 * Padrão RFC 7523 (JWT assinado pelo próprio chamador, estilo `private_key_jwt`):
 * o chamador assina um JWT curto com sua chave privada e publica a chave pública
 * em `jwksUri`; este backend valida assinatura, `iss`, `aud` e `exp` a cada requisição.
 *
 * Declarado por ambiente em `IBackend.trustedCallers`, nunca no contrato — forms
 * são compartilhados entre projetos e o JWKS muda por ambiente.
 */
export interface ITrustedCaller {
  id: string;
  /** Valor esperado na claim `iss` do JWT. */
  issuer: string;
  /** URL do JWKS onde o chamador publica a(s) chave(s) pública(s). */
  jwksUri: string;
  /** Valor esperado na claim `aud` do JWT — identifica este backend. */
  audience: string;
  /** Algoritmos aceitos. Apenas assimétricos; o gerador assume `["RS256"]` se omitido. */
  algorithms?: ("RS256" | "ES256")[];
}
