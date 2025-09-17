import { sugestoBackoffice } from './my_rapida_projects/projects/sugestoBackoffice';
import { tsProjectToJsonProject } from './src/controllers/ts_project_to_json_project';
import { validateProjectJson } from './src/utils/json';

/**
 * ts to json
 */
const tsToJson = tsProjectToJsonProject(sugestoBackoffice);

/**
 * validate project json schema 
 **/
validateProjectJson(tsToJson, 'project');
