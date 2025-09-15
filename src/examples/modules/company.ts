import type { IModule } from "../../interfaces/project.interface";
import { companyForm } from "../components/forms/company.form";
import { companyList } from "../components/lists/company.list";

export const companyModule: IModule = {
  title: "Empresa",
  id: "companyModule",
  icon: "store",
  components: [
    companyForm,
    companyList,
  ]
};