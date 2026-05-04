import type { IModule } from "../../interfaces/project.interface";
import { characterForm } from "../components/forms/character.form";
import { characterList } from "../components/lists/character.list";
import { characterTable } from "../components/tables/character.table";

export const characterModule: IModule = {
  id: "characterModule",
  title: "Personagem",
  icon: "drama",
  components: [
    characterForm,
    characterList,
  ]
};