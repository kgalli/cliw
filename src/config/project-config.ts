export default interface ProjectConfig {
  name: string
  workDir: string
  mainConfigLocation: string
  defaultBuildOrigin: BuildOrigin
  servicesBuildOrigin: ServicesBuildOrigin
}

export interface ServicesRunType {
  [key: string]: RunTypeFlag
}

export const enum RunTypeFlag {
  IMAGE = 'image', SRC = 'src'
}

export interface ServicesBuildOrigin {
  [key: string]: BuildOrigin
}

export const enum BuildOrigin {
  SOURCE = 'source', REGISTRY = 'registry'
}
