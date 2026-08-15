export interface INotification {
  source: {
    type: "internal" | "external";
    internal?: { contractId: string }; // referencia IContract.id/IPublicContract.id já declarado em algum IForm
    external?: { endpoint: string }; // URL completa, fora do backend gerado por este projeto
  };
  condition: INotificationCondition[]; // sempre avaliado contra o payload recebido (resposta do poll ou corpo do webhook), nunca usado para montar a request
  removeAfterWatch?: boolean;
  isFromUser?: boolean; // Whether the notification is from a user action or not. If not, it is from the system.
  isWebhook?: boolean; // Whether the notification is a webhook or not.
}

interface INotificationCondition {
  field: string; // path dentro do JSON recebido
  value: string;
  comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
  logicalOperator?: "&&" | "!" | "nor" | "||";
}
