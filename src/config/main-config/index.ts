import FileUtils from '../file-utils'

import Compose from './compose'
import DbTools from './db-tools'

export interface MainConfig {
  compose: Compose
  dbTools: DbTools
}

export function loadMainConfig(mainConfigLocation: string): MainConfig {
  return FileUtils.load(mainConfigLocation, 'MainConfig') as MainConfig
}
