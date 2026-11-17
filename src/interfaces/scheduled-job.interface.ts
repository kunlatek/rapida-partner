/**
 * Job agendado do backend gerado (`IBackend.scheduledJobs`), por ambiente.
 *
 * O `id` identifica um job que o próprio skeleton/funcionalidade gera; aqui o
 * projeto só ajusta a frequência. Ids conhecidos:
 * - "referralPriceSnapshot": captura de preços dos anúncios do skeleton
 *   "referralCommerce" (base de `IReferralPriceBaseline`). Respeite o limite
 *   de requisições das APIs de afiliado ao escolher a frequência.
 */
export interface IScheduledJob {
  id: string;
  // Expressão cron de 5 campos (ex.: "0 */6 * * *").
  cron: string;
  // Fuso IANA do agendador (ex.: "America/Sao_Paulo"); padrão do servidor se omitido.
  timezone?: string;
}
