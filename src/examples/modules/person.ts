import type { IModule } from "../../interfaces/project.interface";
import { personForm } from "../components/forms/person.form";
import { personList } from "../components/lists/person.list";

export const personModule: IModule = {
  title: "Pessoa",
  id: "personModule",
  icon: "person",
  components: [
    personForm,
    personList,
  ]
};