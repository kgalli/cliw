interface MainConfig {
  compose: {
    workDir: string
    projectName: string
    networkName: string
    environments: string[],
    defaultEnvironment: string
    services: Service[]
  }

  dbTools: {
    environments: string[],
    defaultEnvironment: string
    dataSources: DataSource[]
  },
}

interface Service {
  name: string
  environments: {
    default: DefaultEnvironment
    [key: string]: Environment
  },
  repositoryUrl: string
  source: CodeSource
}

interface DataSource {
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

export default interface DataSourceParams {
  host: string
  port: number
  user: string
  password: string
  database: string
  engine: DbEngine
  readonly: boolean
  ssh?: SshParams
}

const enum DbEngine {
  postgresql, mysql
}

const enum CodeSource {
  internal, external
}

interface RunType {
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
  runType: RunType
}

export interface Environment {
  ports?: string[]
  runType?: RunType
  environment?: EnvironmentVariable
}

export interface EnvironmentVariable {
  [key: string]: string
}

export {MainConfig, CodeSource, Service, DataSourceParams, DataSource}
