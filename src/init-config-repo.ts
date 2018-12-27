import {existsSync, readFileSync, writeFileSync} from 'fs'

export interface InitConfig {
  mainConfigLocation: string
}

/**
 * InitConfig holds the file location of the main config
 *
 * In the future the InitConfig will support multiple file locations.
 * By doing so the user can switch between projects easily.
 * To support the switch an additional commands has to be added
 * to allow adding and removing main confg file locations to the
 * InitConfig and to set one as default.
 */
export default class InitConfigRepo {
  initConfigFilename: string
  initConfigLocation: string
  cliName: string

  constructor(cliName: string, initConfigFilename: string, initConfigLocation: string) {
    this.initConfigFilename = initConfigFilename
    this.initConfigLocation = initConfigLocation
    this.cliName = cliName
  }

  exists() {
    return existsSync(this.initConfigLocation)
  }

  load(): InitConfig {
    if (existsSync(this.initConfigLocation)) {
      return JSON.parse(readFileSync(this.initConfigLocation).toString())
    }

    throw Error(`InitConfig at '${this.initConfigLocation}' does not exist`)
  }

  save(initConfig: InitConfig) {
    return writeFileSync(this.initConfigLocation, JSON.stringify(initConfig))
  }
}
