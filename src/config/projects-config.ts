import {existsSync, readFileSync, writeFileSync} from 'fs'
import {homedir} from 'os'

const DEFAULT_PROJECT_CONFIG_FILENAME = 'projects.json'
const DEFAULT_PROJECT_CONFIG_LOCATION = `${homedir()}/.config/${DEFAULT_PROJECT_CONFIG_FILENAME}`

export interface ProjectsConfig {
  default: string,
  projects: ProjectConfig[]
}

interface ProjectConfig {
  name: string
  mainConfigLocation: string,
  runTypes: RunType[]
}

interface RunType {
  [key: string]: string
}

export default class ProjectsConfigService {
  private _configLocation: string

  constructor(configFilenameLocation = DEFAULT_PROJECT_CONFIG_LOCATION) {
    this._configLocation = configFilenameLocation
  }

  exists() {
    return existsSync(this._configLocation)
  }

  load(): ProjectsConfig {
    if (existsSync(this._configLocation)) {
      return JSON.parse(readFileSync(this._configLocation).toString())
    }

    throw Error(`ProjectsConfig at '${this._configLocation}' does not exist`)
  }

  loadDefault(): ProjectConfig {
    const projectsConfig = this.load()
    const projectConfig = projectsConfig.projects.find(p => p.name === projectsConfig.default)

    if (projectConfig) {
      return projectConfig
    }

    throw new Error('No default project defined')
  }

  save(projectsConfig: ProjectsConfig) {
    return writeFileSync(this._configLocation, JSON.stringify(projectsConfig))
  }
}
