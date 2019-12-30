import FileUtils from '../../utils/file-utils'
import DbTools from '../../wrapper/db-tools/config/db-tools'
import Compose from '../../wrapper/docker-compose/config/compose'

export interface MainConfig {
  compose: Compose
  dbTools: DbTools
}

export function loadMainConfig(mainConfigLocation: string): MainConfig {
  return FileUtils.load(mainConfigLocation, 'MainConfig') as MainConfig
}
