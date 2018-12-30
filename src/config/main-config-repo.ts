import {existsSync, readFileSync, writeFileSync} from 'fs'
import {isEmpty} from 'lodash'

interface MainConfig {
  workDir: string
  projectName: string
  networkName: string
  environments: string[],
  services: Service[],
  defaultEnvironment: string
}

interface Service {
  name: string
  environments: {
    default: DefaultEnvironment
  },
  repositoryUrl: string
  source: CodeSource
}

const enum CodeSource {
  internal, external
}

interface Runtype {
  image: string
  src: {
    build: {
      context: string
      dockerfile: string
    }
  }
}

interface DefaultEnvironment {
  ports: string[]
  runType: Runtype
}
export {MainConfig, MainConfigRepo, Service, CodeSource}

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
