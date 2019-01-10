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

export {MainConfig, CodeSource, Service}
