import { EFormContractDataType } from "../../../enums/form-contract.enum";
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
      endpoint: "/customers/people",
      actions: ["create", "update", "get", "getById", "delete"],
      request: {
        entity: "Customers",
        relatedEntity: "People",
        fields: [
          ...(personForm.contracts[0].request?.fields || []), 
          { name: "entityId", dataType: EFormContractDataType.UNIQUEIDENTIFIER },
          { name: "entityRelated", dataType: EFormContractDataType.NVARCHAR }
        ]
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
      endpoint: "/customers/companies",
      actions: ["create", "update", "get", "getById", "delete"],
      request: {
        entity: "Customers",
        relatedEntity: "Companies",
        fields: [
          ...(companyForm.contracts[0].request?.fields || []), 
          { name: "entityId", dataType: EFormContractDataType.UNIQUEIDENTIFIER },
          { name: "entityRelated", dataType: EFormContractDataType.NVARCHAR }
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