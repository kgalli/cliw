import DataSource from './data-source'

export interface MainConfig {
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

export interface Service {
  name: string
  environments: {
    default: DefaultEnvironment
    [key: string]: Environment
  },
  repositoryUrl: string
  source: CodeSource
}

export const enum CodeSource {
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
