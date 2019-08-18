export default interface DataSource {
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

export enum DbEngine {
  POSTGRES = 'postgresql', MYSQL = 'mysql'
}
