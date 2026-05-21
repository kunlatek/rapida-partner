import type { IProject } from "../interfaces/project.interface";
import { writeFile } from "../utils/file";

const tsProjectToJsonProject = (
  project: IProject,
  outputPath?: string,
): string => {
  console.log(project);
  const json = JSON.stringify(project, null, 2); // Pretty print for readability
  const finalOutputPath = outputPath || "./rapidaObject.json";

  writeFile(json, finalOutputPath);
  console.info(`Project written to file: ${finalOutputPath}`);

  return json;
};

export { tsProjectToJsonProject };
