export type INotificationRecipients =
  | "allUsers"
  | { field: string; property?: string } // valor do destinatário vem de um campo do registro recebido (mesmo formato de IForm.sendMessage.to)
  | { role: string };

export interface INotification {
  id: string;
  title: string; // texto exibido na central de notificações, fixo (não interpolado)
  message: string; // corpo da notificação; suporta {{campo}} interpolado a partir do registro que bateu a condição
  source: {
    type: "internal" | "external";
    internal?: { contractId: string }; // referencia IContract.id/IPublicContract.id já declarado em algum IForm
    external?: { endpoint: string }; // URL completa, fora do backend gerado por este projeto
  };
  condition: INotificationCondition[]; // sempre avaliado contra o payload recebido (resposta do poll ou corpo do webhook), nunca usado para montar a request
  recipients: INotificationRecipients;
  removeAfterWatch?: boolean;
  isFromUser?: boolean; // Whether the notification is from a user action or not. If not, it is from the system.
  isWebhook?: boolean; // Whether the notification is a webhook or not.
}

export interface INotificationCondition {
  field: string; // path dentro do JSON recebido
  value: string;
  comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
  logicalOperator?: "&&" | "!" | "nor" | "||";
}
