import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs'
import {isEmpty} from 'lodash'
import {homedir} from 'os'

import {MainConfig} from './main-config'
import ProjectConfig from './project-config'
import ProjectsConfig from './projects-config'

const DEFAULT_PROJECT_CONFIG_FILENAME = 'projects.json'
const DEFAULT_PROJECT_CONFIG_PATH = `${homedir()}/.config/cliw`
let DEFAULT_PROJECT_CONFIG_LOCATION = `${DEFAULT_PROJECT_CONFIG_PATH}/${DEFAULT_PROJECT_CONFIG_FILENAME}`

mkdirSync(DEFAULT_PROJECT_CONFIG_PATH, {recursive: true, mode: 755})

if (!isEmpty(process.env.CLIW_PROJECT_CONFIG_LOCATION)) {
  DEFAULT_PROJECT_CONFIG_LOCATION = process.env.CLIW_PROJECT_CONFIG_LOCATION as string
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

  private static load(fileLocation: string, configName: string): ProjectsConfig | MainConfig {
    if (existsSync(fileLocation)) {
      return JSON.parse(readFileSync(fileLocation).toString())
    }

    throw Error(`${configName} at '${fileLocation}' does not exist`)
  }

  private static writeJson(config: MainConfig | ProjectsConfig, fileLocation: string) {
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
