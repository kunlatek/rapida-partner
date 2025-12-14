import { tsProjectToJsonProject } from './src/controllers/ts_project_to_json_project';
import { administrado } from '/home/ryzzan/Projects/Kunlatek/Rapida/rapida-projects/src/projects/administrado/administrado.ts';
import { validateProjectJson } from './src/utils/json';

/**
 * ts to json
 */
const tsToJson = tsProjectToJsonProject(administrado);

/**
 * validate project json schema 
 **/
validateProjectJson(tsToJson, 'project');
