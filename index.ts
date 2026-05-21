#!/usr/bin/env node

import { tsProjectToJsonProject } from "./src/controllers/ts_project_to_json_project";
import { validateProjectJson } from "./src/utils/json";
import type { IProject } from "./src/interfaces/project.interface";
import * as fs from "fs";
import * as path from "path";

function isProjectObject(obj: any): obj is IProject {
  return obj && typeof obj === "object" && obj.id && obj.title && obj.skeleton;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "Usage: bun index.ts <path-to-project-file> [output-json-path]",
    );
    console.error(
      "Example: bun index.ts ./src/examples/projects/movieBackoffice.ts ./rapidaObject.json",
    );
    process.exit(1);
  }

  const projectFilePath = path.resolve(args[0]);
  const outputPath = args[1] || "./rapidaObject.json";

  if (!fs.existsSync(projectFilePath)) {
    console.error(`File not found: ${projectFilePath}`);
    process.exit(1);
  }

  try {
    // Dynamically import the project module
    const module = await import(projectFilePath);

    let project: IProject | undefined;

    // 1. Check for default export
    if (module.default && isProjectObject(module.default)) {
      project = module.default;
    }
    // 2. Check for named export 'project'
    else if (module.project && isProjectObject(module.project)) {
      project = module.project;
    }
    // 3. Scan all exports and find the first valid project object
    else {
      const exportKeys = Object.keys(module);
      for (const key of exportKeys) {
        const exported = module[key];
        if (isProjectObject(exported)) {
          project = exported;
          console.info(`Using export "${key}" as project.`);
          break;
        }
      }
    }

    if (!project) {
      const availableExports = Object.keys(module).join(", ");
      console.error(`No valid project export found in ${projectFilePath}.`);
      console.error(`Available exports: ${availableExports || "none"}`);
      console.error("Expected an object with properties: id, title, skeleton");
      process.exit(1);
    }

    // Generate JSON from project
    const jsonString = tsProjectToJsonProject(project, outputPath);
    const jsonObject = JSON.parse(jsonString);

    // Validate generated JSON against schema
    const isValid = validateProjectJson(jsonObject, "project");
    if (!isValid) {
      console.error("Generated JSON validation failed.");
      process.exit(1);
    }

    console.info("Project JSON successfully generated and validated.");
  } catch (error) {
    console.error("Error processing project:", error);
    process.exit(1);
  }
}

main();
