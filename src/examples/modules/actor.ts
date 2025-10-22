import type { IModule } from "../../interfaces/project.interface";
import { actorForm } from "../components/forms/actor.form";
import { actorList } from "../components/lists/actor.list";

export const actorModule: IModule = {
  id: "actorModule",
  title: "Ator / Atriz",
  icon: "actor",
  components: [
    actorForm,
    actorList,
  ]
};