/**
 * Ids dos jobs que o próprio skeleton/funcionalidade gera:
 * - "referralPriceSnapshot": captura de preços dos anúncios do skeleton
 *   "referralCommerce" (base de `IReferralPriceBaseline`). Respeite o limite
 *   de requisições das APIs de afiliado ao escolher a frequência.
 */
export type TScheduledJobId = "referralPriceSnapshot";

/**
 * Job agendado do backend gerado (`IBackend.scheduledJobs`), por ambiente.
 * O projeto só ajusta a frequência de um job que o gerador já cria.
 */
export interface IScheduledJob {
  id: TScheduledJobId;
  // Expressão cron de 5 campos (ex.: "0 */6 * * *").
  cron: string;
  // Fuso IANA do agendador (ex.: "America/Sao_Paulo"); padrão do servidor se omitido.
  timezone?: string;
}
