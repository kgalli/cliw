import {load} from '../../../utils/file-utils'

export default interface DbToolsConfig {
  environments: string[]
  defaultEnvironment: string
  dataSources: DataSource[]
}

export interface DataSource {
  name: string
  environments: {
    [key: string]: DataSourceParams
  }
}

interface SshParams {
  beforeShellCmd?: string
  jumpHost: string
  localPort: number
}

export interface DataSourceParams {
  host: string
  port: number
  user: string
  password: string
  passwordEncryption: string
  database: string
  engine: DbEngine
  readonly: boolean
  ssh?: SshParams
}

export const enum PasswordEncryption {
  NONE = 'none', AWSKMS = 'amskms'
}

const enum DbEngine {
  POSTGRES = 'postgresql', MYSQL = 'mysql'
}

export function loadDbToolsConfig(dbToolsConfigLocation: string): DbToolsConfig {
  const mainConfig = load(dbToolsConfigLocation, 'DbToolsConfig')

  return mainConfig.dbTools as DbToolsConfig
}
