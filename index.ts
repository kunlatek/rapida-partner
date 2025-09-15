import { tsProjectToJsonProject } from './src/controllers/ts_project_to_json_project';
import { validateProjectJson } from './src/utils/json';

import { movieBackoffice } from './src/examples/projects/movieBackoffice';

/**
 * ts to json
 */
const tsToJson = tsProjectToJsonProject(movieBackoffice);

/**
 * validate project json schema 
 **/
validateProjectJson(tsToJson, 'project');
