import type { IModule } from "../../interfaces/project.interface";
import { projectForm } from "../components/forms/project.form";
import { taskWithProjectForm } from "../components/forms/taskWithProject.form";
import { projectList } from "../components/lists/project.list";
import { taskWithProjectList } from "../components/lists/taskWithProject.list";

export const projectModule: IModule = {
  id: "projectModule",
  title: "Projeto",
  icon: "chart-gantt",
  components: [
    projectForm,
    projectList,
    
    taskWithProjectForm,
    taskWithProjectList,
  ],
};