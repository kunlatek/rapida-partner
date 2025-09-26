import { EDataType } from "../../../enums/form.enum";
import type { IForm } from "../../../interfaces/form.interface";
import { companyForm } from "./company.form";
import { personForm } from "./person.form";

export const customerForm: IForm = {
  title: "Gerenciar cliente",
  id: "customerForm",
  componentType: "form",
  contracts: [
    {
      id: "customerPeople",
      endpoint: "/customers/people",
      actions: ["create", "update", "get", "getById", "delete"],
      request: {
        entity: "Customers",
        relatedEntity: {
          entity: "People", // adiciona campo chamado relatedEntity amaarrado ao valor
          connectionAttribute: "_id", // vai criar um campo chamado relatedEntityId
          fieldsFromEntity: [{
            fields: personForm,
            contractId: "people",            
          }]
        },
        fields: []
      },
      conditions: [
        {
          type: "form",
          elements: [
            {
              key: "entityRelated",
              comparisonOperator: "===",
              value: "People"
            }
          ]
        }
      ]
    },
    {
      id: "customerCompanies",
      endpoint: "/customers/companies",
      actions: ["create", "update", "get", "getById", "delete"],
      request: {
        entity: "Customers",
        relatedEntity: {
          entity: "Companies",
          connectionAttribute: "_id",
          fieldsFromEntity: [
            {
              fields: companyForm,
              contractId: "companies"
            }
          ]
        },
        fields: [
          { name: "entityId", dataType: EDataType.UNIQUEIDENTIFIER },
          { name: "entityRelated", dataType: EDataType.NVARCHAR }
        ]
      },
      conditions: [
        {
          type: "form",
          elements: [
            {
              key: "entityRelated",
              comparisonOperator: "===",
              value: "Companies"
            }
          ]
        }
      ]
    }
  ],
  elements: [
    {
      type: "select",
      dataType: EDataType.NVARCHAR,
      label: "Tipo de cliente",
      name: "entityRelated",
      options: [
        { label: "Pessoa", value: "People" },
        { label: "Empresa", value: "Companies" }
      ],
      isDisabledOnUpdate: true,
    },
    {
      type: "inheritance",
      form: personForm,
      conditions: [
        {
          type: "form",
          elements: [
            {
              key: "entityRelated",
              comparisonOperator: "===",
              value: "People"
            }
          ]
        }
      ]
    },
    {
      type: "inheritance",
      form: companyForm,
      conditions: [
        {
          type: "form",
          elements: [
            {
              key: "entityRelated",
              comparisonOperator: "===",
              value: "Companies"
            }
          ]
        }
      ]
    }
  ]
}