import DataSource from './data-source'

export interface MainConfig {
  compose: {
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

interface BuildOrigin {
  registry: {
    image: string
  },
  source: {
    build: {
      context: string
      dockerfile: string
    }
  }
}

interface DefaultEnvironment {
  ports: string[]
  buildOrigin: BuildOrigin
}

export interface Environment {
  ports?: string[]
  buildOrigin: BuildOrigin
  environment?: EnvironmentVariable
}

export interface EnvironmentVariable {
  [key: string]: string
}
