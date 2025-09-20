import { mezuriArchitect } from './my_rapida_projects/projects/mezuriArchitect';
import { tsProjectToJsonProject } from './src/controllers/ts_project_to_json_project';
import { validateProjectJson } from './src/utils/json';

/**
 * ts to json
 */
const tsToJson = tsProjectToJsonProject(mezuriArchitect);

/**
 * validate project json schema 
 **/
validateProjectJson(tsToJson, 'project');
