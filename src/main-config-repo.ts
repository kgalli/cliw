import {existsSync, readFileSync, writeFileSync} from 'fs'
import {isEmpty} from 'lodash'

interface MainConfig {
  workDir: string
  projectName: string
  networkName: string
  environments: string[],
  services: string[],
  internalServices: string[],
  externalServices: string[],
  defaultEnvironment: string
}

export {MainConfig, MainConfigRepo}

export default class MainConfigRepo {
  mainConfigLocation: string

  constructor(mainConfigLocation: string) {
    this.mainConfigLocation = mainConfigLocation
  }

  exists() {
    return isEmpty(this.load()) === false
  }

  load(): MainConfig {
    if (existsSync(this.mainConfigLocation)) {
      return JSON.parse(readFileSync(this.mainConfigLocation).toString())
    }

    throw Error(`MainConfig at '${this.mainConfigLocation}' does not exist`)
  }

  save(mainConfig: MainConfig) {
    return writeFileSync(this.mainConfigLocation, JSON.stringify(mainConfig))
  }
}
