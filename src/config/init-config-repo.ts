import {existsSync, readFileSync, writeFileSync} from 'fs'
import {homedir} from 'os'

const INIT_CONFIG_FILENAME = '.orchestrator-init-config.json'
const INIT_CONFIG_LOCATION = `${homedir()}/${INIT_CONFIG_FILENAME}`

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
  set initConfigFilename(value: string) {
    this._initConfigFilename = value
  }

  set initConfigLocation(value: string) {
    this._initConfigLocation = value
  }

  private _initConfigFilename: string
  private _initConfigLocation: string

  constructor() {
    this._initConfigFilename = INIT_CONFIG_FILENAME
    this._initConfigLocation = INIT_CONFIG_LOCATION
  }

  exists() {
    return existsSync(this._initConfigLocation)
  }

  load(): InitConfig {
    if (existsSync(this._initConfigLocation)) {
      return JSON.parse(readFileSync(this._initConfigLocation).toString())
    }

    throw Error(`InitConfig at '${this._initConfigLocation}' does not exist`)
  }

  save(initConfig: InitConfig) {
    return writeFileSync(this._initConfigLocation, JSON.stringify(initConfig))
  }
}
