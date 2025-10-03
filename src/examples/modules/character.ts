import type { IModule } from "../../interfaces/project.interface";
import { characterForm } from "../components/forms/character.form";
import { characterList } from "../components/lists/character.list";

export const characterModule: IModule = {
  id: "characterModule",
  title: "Personagem",
  icon: "character",
  components: [
    characterForm,
    characterList,
  ]
};