import {isEmpty} from 'lodash'
import {homedir} from 'os'

import {ProjectConfig, ProjectsConfig} from '../types/projects-config'
import {mkdir} from '../utils/file-utils'

import ProjectsConfigRepo from './projects-config'

export const DEFAULT_CONFIG_PATH = isEmpty(process.env.CLIW_CONFIG_PATH) ?
  `${homedir()}/.config/cliw` :
  process.env.CLIW_CONFIG_PATH as string

mkdir(DEFAULT_CONFIG_PATH)

const projectsConfigRepo = new ProjectsConfigRepo(DEFAULT_CONFIG_PATH)

// TODO revisit: the first time cliw is run projects config does not exist.
// Maybe it is best to write empty file and do checks based on file content.
export let defaultProject = {} as ProjectConfig
export let DEFAULT_CONFIG_PATH_ACTIVE_PROJECT = ''

if (projectsConfigRepo.exists()) {
  defaultProject = projectsConfigRepo.loadDefaultProjectConfig()
  DEFAULT_CONFIG_PATH_ACTIVE_PROJECT = `${DEFAULT_CONFIG_PATH}/${defaultProject.name}`

  mkdir(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT)
}

export function projectsConfigInitialize(project: string, configDir: string, workDir: string): ProjectsConfig {
  return projectsConfigRepo.initialize(project, workDir, configDir)
}

export function projectsConfigLoad(): ProjectsConfig {
  return projectsConfigRepo.load()
}

export function projectsConfigExists(): boolean {
  return projectsConfigRepo.exists()
}

export function projectsConfigAddProject(project: string, configDir: string, workDir: string): ProjectsConfig {
  return projectsConfigRepo.addProject(project, workDir, configDir)
}

export function projectsConfigRemoveProject(project: string) {
  return projectsConfigRepo.removeProject(project)
}

export function projectsConfigSetDefault(project: string) {
  projectsConfigRepo.setDefaultProject(project)
}
