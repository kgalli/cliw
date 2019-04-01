interface MainConfig {
  workDir: string
  projectName: string
  networkName: string
  environments: string[],
  services: Service[],
  defaultEnvironment: string
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

export {MainConfig, CodeSource, Service}
