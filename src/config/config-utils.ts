import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
import {safeLoad} from 'js-yaml'
import {isEmpty} from 'lodash'
import {homedir} from 'os'

import {BuildOriginsConfig, ServicesBuildOrigin} from './build-origins-config'
import {MainConfig} from './main-config'
import ProjectConfig from './project-config'
import ProjectsConfig from './projects-config'

const DEFAULT_CONFIG_PATH = `${homedir()}/.config/cliw`

const DEFAULT_PROJECT_CONFIG_FILENAME = 'projects.json'
let DEFAULT_PROJECT_CONFIG_LOCATION = `${DEFAULT_CONFIG_PATH}/${DEFAULT_PROJECT_CONFIG_FILENAME}`

const DEFAULT_BUILD_ORIGIN_CONFIG_FILENAME = 'build-origins.json'
let DEFAULT_BUILD_ORIGINS_CONFIG_LOCATION = `${DEFAULT_CONFIG_PATH}/${DEFAULT_BUILD_ORIGIN_CONFIG_FILENAME}`

if (!existsSync(DEFAULT_CONFIG_PATH)) {
  mkdirSync(DEFAULT_CONFIG_PATH, {recursive: true, mode: 755})
}

if (!isEmpty(process.env.CLIW_PROJECT_CONFIG_LOCATION)) {
  DEFAULT_PROJECT_CONFIG_LOCATION = process.env.CLIW_PROJECT_CONFIG_LOCATION as string
}

if (!isEmpty(process.env.CLIW_BUILD_ORIGINS_CONFIG_LOCATION)) {
  DEFAULT_BUILD_ORIGINS_CONFIG_LOCATION = process.env.CLIW_BUILD_ORIGINS_CONFIG_LOCATION as string
}

// tslint:disable-next-line no-unnecessary-class
export default class ConfigUtils {
  static projectsConfigExists(projectsConfigLocation: string = DEFAULT_PROJECT_CONFIG_LOCATION) {
    return ConfigUtils.exists(projectsConfigLocation)
  }

  static projectsConfigLoad(projectsConfigLocation: string = DEFAULT_PROJECT_CONFIG_LOCATION): ProjectsConfig {
    return ConfigUtils.load(projectsConfigLocation, 'ProjectsConfig') as ProjectsConfig
  }

  static projectConfigLoadByName(name: string, projectsConfigLocation: string = DEFAULT_PROJECT_CONFIG_LOCATION): ProjectConfig {
    const projectsConfig = ConfigUtils.projectsConfigLoad(projectsConfigLocation)

    return ConfigUtils.projectConfigByName(projectsConfig, name)
  }

  static projectsConfigLoadDefault(projectsConfigLocation: string = DEFAULT_PROJECT_CONFIG_LOCATION): ProjectConfig {
    const projectsConfig = ConfigUtils.projectsConfigLoad(projectsConfigLocation)

    return ConfigUtils.projectConfigByName(projectsConfig, projectsConfig.default)
  }

  static projectsConfigSave(projectsConfig: ProjectsConfig, projectsConfigLocation: string = DEFAULT_PROJECT_CONFIG_LOCATION) {
    return ConfigUtils.writeJson(projectsConfig, projectsConfigLocation)
  }

  static projectsConfigDelete(projectsConfigLocation: string = DEFAULT_PROJECT_CONFIG_LOCATION) {
    return ConfigUtils.delete(projectsConfigLocation)
  }

  static buildOriginConfigLoadDefault(buildOriginConfigLocation: string = DEFAULT_BUILD_ORIGINS_CONFIG_LOCATION): ServicesBuildOrigin {
    const projectConfig = ConfigUtils.projectsConfigLoadDefault()
    const buildOriginConfig = ConfigUtils.buildOriginConfigLoad(buildOriginConfigLocation)

    return buildOriginConfig[projectConfig.name]
  }

  static buildOriginConfigLoad(buildOriginConfigLocation: string = DEFAULT_BUILD_ORIGINS_CONFIG_LOCATION): BuildOriginsConfig {
    return ConfigUtils.load(buildOriginConfigLocation, 'BuildOriginsConfig') as BuildOriginsConfig
  }

  static buildOriginsConfigSave(buildOriginsConfig: BuildOriginsConfig, buildOriginsConfigLocation: string = DEFAULT_BUILD_ORIGINS_CONFIG_LOCATION) {
    return ConfigUtils.writeJson(buildOriginsConfig, buildOriginsConfigLocation)
  }

  static mainConfigExists(mainConfigLocation: string) {
    return ConfigUtils.exists(mainConfigLocation)
  }

  static mainConfigLoadDefault(): MainConfig {
    const projectConfig = ConfigUtils.projectsConfigLoadDefault()
    const mainConfig = ConfigUtils.mainConfigLoad(projectConfig.mainConfigLocation)

    return mainConfig
  }

  static mainConfigLoad(mainConfigLocation: string): MainConfig {
    return ConfigUtils.load(mainConfigLocation, 'MainConfig') as MainConfig
  }

  static mainConfigSave(mainConfig: MainConfig, mainConfigLocation: string) {
    return ConfigUtils.writeJson(mainConfig, mainConfigLocation)
  }

  static exists(fileLocation: string): boolean {
    return existsSync(fileLocation)
  }

  private static load(fileLocation: string, configName: string): ProjectsConfig | MainConfig | BuildOriginsConfig {
    if (existsSync(fileLocation)) {
      if (fileLocation.endsWith('yaml') || fileLocation.endsWith('yml')) {
        return safeLoad(readFileSync(fileLocation, 'utf8'))
      }

      return JSON.parse(readFileSync(fileLocation, 'utf8').toString())
    }

    throw Error(`${configName} at '${fileLocation}' does not exist`)
  }

  private static delete(fileLocation: string) {
    if (existsSync(fileLocation)) {
      return unlinkSync(fileLocation)
    }

    throw Error(`File '${fileLocation}' to delete does not exist`)
  }

  private static writeJson(config: MainConfig | ProjectsConfig | BuildOriginsConfig, fileLocation: string) {
    return writeFileSync(fileLocation, JSON.stringify(config))
  }

  private static projectConfigByName(projectsConfig: ProjectsConfig, name: string): ProjectConfig {
    const projectConfig = projectsConfig.projects.find(p => p.name === name)

    if (projectConfig) {
      return projectConfig
    }

    throw new Error('No default project defined')
  }
}
