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
    connections: Connection[]
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

interface Connection {
  name: string
  environments: {
    [key: string]: ConnectionParams
  }
}

export default interface ConnectionParams {
  host: string
  port: number
  user: string
  password: string
  database?: string
  command?: string
  engine: DbEngine
  ssh?: any
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

export {MainConfig, CodeSource, Service, Connection}
