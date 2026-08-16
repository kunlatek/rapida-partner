import type { INotificationCondition, INotificationRecipients } from "./notification.interface";

export interface IRecordReminder {
  id: string;
  title: string; // texto exibido na central de notificações, fixo (não interpolado)
  message: string; // corpo da notificação; suporta {{campo}} interpolado a partir do registro observado
  contractId: string; // contrato (IContract.id) cujos registros serão observados
  dateField: string; // campo de data do registro usado como referência do lembrete
  timeField?: string; // campo de hora do registro (HH:MM); se ausente, dispara em qualquer horário do dia
  offsetDays?: number; // deslocamento em dias em relação a dateField: 0 = no dia (padrão), negativo = antes, positivo = depois
  condition?: INotificationCondition[]; // filtros adicionais sobre o registro (ex.: não lembrar contas já liquidadas)
  recipients: INotificationRecipients;
  removeAfterNotify?: boolean; // evita notificar de novo o mesmo registro depois do primeiro disparo
}
