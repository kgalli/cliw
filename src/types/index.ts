export default interface ServiceWrapper {
  exec(options: ExecOptions, service: string, cmd: string): void
  log(options: LogOptions, services: string[]): void
  run(options: RunOptions, service: string, cmd: string): void
  start(options: StartOptions, services: string[]): void
  status(options: StatusOptions, services: string[]): void
  stop(options: StopOptions, services: string[]): void
}

export interface ExecOptions {
  noTty: boolean
}

export interface LogOptions {
  follow: boolean
  timestamps: boolean
}

export interface RunOptions {
  entrypoint?: string
  noTty: boolean
}

export interface StartOptions {
  build: boolean
}

export interface StopOptions {
  timeout?: number
}

export interface StatusOptions {
  showAll: boolean
}

export interface DbParameterConfig {
  environments: string[]
  defaultEnvironment: string
  parameters: EnvironmentServicesMap
}

interface EnvironmentServicesMap {
  [key: string]: DataSourceParams
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

export type ShellCallback = (cmd: string) => void
export type ShellCallbackPromise = (cmd: string) => Promise<string>
