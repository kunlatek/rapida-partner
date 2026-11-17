/**
 * Ids dos jobs que o próprio skeleton/funcionalidade gera:
 * - "referralPriceSnapshot": captura de preços dos anúncios do skeleton
 *   "referralCommerce" (base de `IReferralPriceBaseline`). Respeite o limite
 *   de requisições das APIs de afiliado ao escolher a frequência.
 * - "aiAgentAppointmentReminder": lembrete de agendamento do agente de IA
 *   (`IAiAgentConfig.jobs.reminder`). Roda no processo do agente, não no
 *   backend Nest. O `timezone` também é o fuso em que os horários dos
 *   agendamentos estão gravados. Sem entrada, o agente usa "*\/2 * * * *" e
 *   "America/Sao_Paulo".
 */
export type TScheduledJobId =
  | "referralPriceSnapshot"
  | "aiAgentAppointmentReminder";

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
