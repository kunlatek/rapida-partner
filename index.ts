import { tsProjectToJsonProject } from './src/controllers/ts_project_to_json_project';
import { movieBackoffice } from './src/examples/projects/movieBackoffice';
import { validateProjectJson } from './src/utils/json';

/**
 * ts to json
 */
const tsToJson = tsProjectToJsonProject(movieBackoffice);

/**
 * validate project json schema 
 **/
validateProjectJson(tsToJson, 'project');
