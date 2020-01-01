import {isEmpty} from 'lodash'
import {homedir} from 'os'

import FileUtils from '../utils/file-utils'

import FileRepository from './file-repository'
import ProjectsConfigHelper, {ProjectsConfig} from './projects-config/index'

export const DEFAULT_CONFIG_PATH = isEmpty(process.env.CLIW_DEFAULT_CONFIG_PATH)
  ? `${homedir()}/.config/cliw`
  : process.env.CLIW_DEFAULT_CONFIG_PATH as string

FileUtils.mkdir(DEFAULT_CONFIG_PATH)

const DEFAULT_PROJECTS_CONFIG_FILENAME = 'projects.json'
const projectsConfigLocation = `${DEFAULT_CONFIG_PATH}/${DEFAULT_PROJECTS_CONFIG_FILENAME}`
const projectsConfigRepository = new FileRepository(projectsConfigLocation, 'ProjectsConfig')
const projectsConfigHelper = new ProjectsConfigHelper(projectsConfigRepository)

export const defaultProject = projectsConfigHelper.loadDefaultProjectConfig()
export const DEFAULT_CONFIG_PATH_ACTIVE_PROJECT = `${DEFAULT_CONFIG_PATH}/${defaultProject.name}`

FileUtils.mkdir(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT)

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
