import {existsSync, readFileSync, writeFileSync} from 'fs'
import {isEmpty} from 'lodash'

import {MainConfig} from './main-config'

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
