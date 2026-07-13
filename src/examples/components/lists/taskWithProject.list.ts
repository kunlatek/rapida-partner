import { EDataType } from "../../../enums/form.enum";
import type { IList } from "../../../interfaces/list.interface";

export const taskWithProjectList: IList = {
  title: "Lista de tarefas",
  id: "taskWithProjectList",
  componentType: "list",
  dataSource: {
    endpoint: "/tasks",
    paramType: "query",
    hasAuthentication: true,
  },
  listItems: [
    {
      property: "title",
      type: "title",
      label: "Título",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "projectId.title",
      type: "subtitle",
      label: "Projeto",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "status",
      type: "subtitle",
      label: "Status",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "priority",
      type: "subtitle",
      label: "Prioridade",
      dataType: EDataType.INTEGER,
    },
    {
      property: "developerId.userName",
      type: "subtitle",
      label: "Desenvolvedor",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "validatorId.userName",
      type: "subtitle",
      label: "Validador",
      dataType: EDataType.NVARCHAR,
    },
    {
      property: "approverId.userName",
      type: "subtitle",
      label: "Homologador",
      dataType: EDataType.NVARCHAR,
    },
    // {
    //   property: "_creator.username",
    //   type: "subtitle",
    //   label: "Criador",
    //   dataType: EDataType.NVARCHAR,
    // },
    {
      property: "expectedDeliveryDate",
      type: "subtitle",
      label: "Data esperada de entrega",
      dataType: EDataType.DATE,
    },
  ],
  listFilters: [
    // {
    //   label: "Projeto",
    //   name: "project.title",
    //   type: "input",
    //   dataType: EDataType.NVARCHAR,
    // },
    {
      label: "Tarefa",
      name: "title",
      type: "input",
      dataType: EDataType.NVARCHAR,
    },
    // {
    //   label: "Prioridade",
    //   type: "select",
    //   dataType: EDataType.INTEGER,
    //   name: "priority",
    //   placeholder: "Selecione a prioridade da tarefa",
    //   tooltip: "Nível de urgência da tarefa",
    //   isRequired: true,
    //   options: [
    //     { label: "Baixa", value: 3 },
    //     { label: "Média", value: 2 },
    //     { label: "Alta", value: 1 },
    //     { label: "Urgente", value: 0 },
    //   ],
    // },
    // {
    //   label: "Complexidade",
    //   type: "select",
    //   dataType: EDataType.INTEGER,
    //   name: "complexity",
    //   placeholder: "Selecione a complexidade da tarefa",
    //   tooltip: "Nível de complexidade da tarefa",
    //   isRequired: true,
    //   options: [
    //     { label: "Baixa", value: 1 },
    //     { label: "Média", value: 2 },
    //     { label: "Alta", value: 3 },
    //     { label: "Muito alta", value: 4 },
    //     { label: "Precisa de estudo", value: 0 },
    //   ],
    // },
    // {
    //   label: "Status",
    //   type: "select",
    //   dataType: EDataType.NVARCHAR,
    //   name: "status",
    //   options: [
    //     { label: "Pendente", value: "pending" },
    //     { label: "Em andamento", value: "inProgress" },
    //     { label: "Aguardando validação técnica", value: "awaitingValidation" },
    //     { label: "Aguardando homologação", value: "awaitingApproval" },
    //     { label: "Pendência pós-validação", value: "postValidationPending" },
    //     { label: "Pendência pós-homologação", value: "postApprovalPending" },
    //     { label: "Finalizado", value: "completed" },
    //   ],
    //   isRequired: true,
    // },
    // {
    //   label: "Desenvolvedor",
    //   type: "input",
    //   dataType: EDataType.NVARCHAR,
    //   name: "developer.userName",
    // },
    // {
    //   label: "Validador",
    //   type: "input",
    //   dataType: EDataType.NVARCHAR,
    //   name: "validator.userName",
    // },
    // {
    //   label: "Homologador",
    //   type: "input",
    //   dataType: EDataType.NVARCHAR,
    //   name: "approver.userName",
    // },
  ],
  // archive: [
  //   {
  //     property: "status",
  //     value: "completed",
  //   },
  // ],
  callsToActionMenu: [
    {
      label: "Editar",
      icon: "pencil",
      action: {
        link: {
          endpoint: "/tasks",
          propertiesAsPathParam: ["_id"],
        },
      },
    },
    {
      label: "Excluir",
      icon: "trash",
      action: {
        link: {
          endpoint: "/tasks",
        },
        request: {
          endpoint: "/tasks",
          verb: "softDelete",
          propertiesAsPathParam: ["_id"],
          dialog: {
            title: "Excluir item",
            message: "Deseja realmente excluir esse item?",
          },
        },
      },
    },
  ],

  "pagination": {
    "enabled": true,
    "pageSize": 15,
    "pageSizeOptions": [10, 15, 25, 50],
    "position": "bottom"
   },
  contracts: [
    {
      id: "tasks",
      endpoint: "/tasks",
      actions: ["create", "update", "get", "softDelete", "getById"],
      request: {
        entity: "tasks",
        fields: [],
      },
    },
  ],
};
