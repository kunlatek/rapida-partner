import type { IModule } from "../../interfaces/project.interface";
import { customerForm } from "../components/forms/customer.form";
import { customerList } from "../components/lists/customer.list";

export const customerModule: IModule = {
  title: "Cliente",
  id: "customerModule",
  icon: "UserIcon",
  components: [
    customerForm,
    customerList,
  ]
}