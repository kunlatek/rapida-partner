import * as chp from "child_process";
import * as path from "path";

// Compute root path dynamically from current file location (two levels up from src/utils)
const rootPath = path.resolve(__dirname, "../..");

const appsPath = path.join(rootPath, "rapida-apps");
const examplesPath = path.join(rootPath, "src", "examples");
const modelsPath = path.join(rootPath, "src", "models");
const schemasPath = path.join(rootPath, "src", "schemas");
const scriptsPath = path.join(rootPath, "src", "scripts");

const frontendFrameworkStructuresPath = path.join(
  rootPath,
  "models",
  "frontend",
  "json",
  "frontend-framework-structures",
);
const backendFrameworkStructuresPath = path.join(
  rootPath,
  "models",
  "backend",
  "json",
  "backend-framework-structures",
);

const doesDirectoryExist = (directoryPath: string): boolean => {
  try {
    chp.execSync(`ls ${directoryPath}`, { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
};

export {
  appsPath,
  examplesPath,
  modelsPath,
  schemasPath,
  scriptsPath,
  frontendFrameworkStructuresPath,
  backendFrameworkStructuresPath,
  doesDirectoryExist,
};
