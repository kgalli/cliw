import {existsSync, mkdirSync} from 'fs'
import {isEmpty} from 'lodash'
import {homedir} from 'os'

import ProjectsBuildOriginConfigHelper, {BuildOrigin} from './build-origins-config/index'
import FileRepository from './file-repository'
import {loadMainConfig} from './main-config'
import ProjectsConfigHelper, {ProjectsConfig} from './projects-config/index'

const DEFAULT_CONFIG_PATH = `${homedir()}/.config/cliw`

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

const DEFAULT_PROJECTS_BUILD_ORIGIN_CONFIG_FILENAME = 'projects-build-origins.json'
const DEFAULT_PROJECTS_BUILD_ORIGINS_CONFIG_LOCATION = `${DEFAULT_CONFIG_PATH}/${DEFAULT_PROJECTS_BUILD_ORIGIN_CONFIG_FILENAME}`
const projectsBuildOriginConfigLocation = isEmpty(process.env.CLIW_PROJECTS_BUILD_ORIGINS_CONFIG_LOCATION)
  ? DEFAULT_PROJECTS_BUILD_ORIGINS_CONFIG_LOCATION
  : process.env.CLIW_PROJECTS_BUILD_ORIGINS_CONFIG_LOCATION as string

const projectsBuildOriginConfigHelper = new ProjectsBuildOriginConfigHelper(projectsBuildOriginConfigLocation)

export function projectsConfigInitialize(project: string, mainConfigLocation: string, workDirLocation: string): ProjectsConfig {
  const projectsConfig = projectsConfigHelper.initialize(project, mainConfigLocation, workDirLocation)

  const mainConfig = loadMainConfig(mainConfigLocation)
  const services = mainConfig.compose.services.map(s => s.name)
  const environments = mainConfig.compose.environments

  projectsBuildOriginConfigHelper.addProjectBuildOriginConfig(project, services, environments)

  return projectsConfig
}

export function projectsConfigLoad() {
  return projectsConfigHelper.load()
}

export function projectsConfigExists() {
  return projectsConfigHelper.exists()
}

export function projectsConfigAddProject(project: string, mainConfigLocation: string, workDirLocation: string): ProjectsConfig {
  const projectsConfig = projectsConfigHelper.addProject(project, workDirLocation, mainConfigLocation)

  const mainConfig = loadMainConfig(mainConfigLocation)
  const services = mainConfig.compose.services.map(s => s.name)
  const environments = mainConfig.compose.environments

  projectsBuildOriginConfigHelper.addProjectBuildOriginConfig(project, services, environments)

  return projectsConfig
}

export function projectsConfigRemoveProject(project: string) {
  // TODO cleanup projects-build-origin-config as well

  return projectsConfigHelper.removeProject(project)
}

export function projectsConfigSetDefault(project: string) {
  projectsConfigHelper.setDefaultProject(project)
}

export function projectsConfigLoadDefault() {
  return projectsConfigHelper.loadDefaultProjectConfig()
}

export function projectsBuildOriginConfigLoadDefault() {
  const defaultProject = projectsConfigHelper.loadDefaultProjectConfig()

  return projectsBuildOriginConfigHelper.loadProjectBuildOriginConfig(defaultProject.name)
}

export function projectsBuildOriginConfigUpdateServiceBuildOrigin(service: string,
                                                                  environment: string,
                                                                  buildOrigin: BuildOrigin) {
  const project = projectsConfigHelper.loadDefaultProjectConfig()

  projectsBuildOriginConfigHelper.updateServiceBuildOrigin(project.name, service, environment, buildOrigin)
}

export const extractBuildOrigin = ProjectsBuildOriginConfigHelper.extractBuildOrigin

export function mainConfigLoadDefault() {
  const project = projectsConfigHelper.loadDefaultProjectConfig()

  return mainConfigLoad(project.mainConfigLocation)
}

export const mainConfigLoad = loadMainConfig
