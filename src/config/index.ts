import {existsSync, mkdirSync} from 'fs'
import {isEmpty} from 'lodash'
import {homedir} from 'os'

import FileRepository from './file-repository'
import ProjectsConfigHelper, {ProjectsConfig} from './projects-config/index'

export const DEFAULT_CONFIG_PATH = isEmpty(process.env.CLIW_DEFAULT_CONFIG_PATH)
  ? `${homedir()}/.config/cliw`
  : process.env.CLIW_DEFAULT_CONFIG_PATH as string

if (!existsSync(DEFAULT_CONFIG_PATH)) {
  mkdirSync(DEFAULT_CONFIG_PATH, {recursive: true, mode: 755})
}

const DEFAULT_PROJECTS_CONFIG_FILENAME = 'projects.json'
const DEFAULT_PROJECTS_CONFIG_LOCATION = `${DEFAULT_CONFIG_PATH}/${DEFAULT_PROJECTS_CONFIG_FILENAME}`
const projectsConfigLocation = isEmpty(process.env.CLIW_PROJECTS_CONFIG_LOCATION)
  ? DEFAULT_PROJECTS_CONFIG_LOCATION
  : process.env.CLIW_PROJECTS_CONFIG_LOCATION as string

const projectsConfigRepository = new FileRepository(projectsConfigLocation, 'ProjectsConfig')
const projectsConfigHelper = new ProjectsConfigHelper(projectsConfigRepository)

export const defaultProject = projectsConfigHelper.loadDefaultProjectConfig()
export const DEFAULT_CONFIG_PATH_ACTIVE_PROJECT = `${DEFAULT_CONFIG_PATH}/${defaultProject.name}`

export function projectsConfigInitialize(project: string, mainConfigLocation: string, workDirLocation: string): ProjectsConfig {
  return projectsConfigHelper.initialize(project, mainConfigLocation, workDirLocation)
}

export function projectsConfigLoad(): ProjectsConfig {
  return projectsConfigHelper.load()
}

export function projectsConfigExists(): boolean {
  return projectsConfigHelper.exists()
}

export function projectsConfigAddProject(project: string, mainConfigLocation: string, workDirLocation: string): ProjectsConfig {
  return projectsConfigHelper.addProject(project, workDirLocation, mainConfigLocation)
}

export function projectsConfigRemoveProject(project: string) {
  // TODO cleanup projects folder

  return projectsConfigHelper.removeProject(project)
}

export function projectsConfigSetDefault(project: string) {
  projectsConfigHelper.setDefaultProject(project)
}
