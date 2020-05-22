export interface ServiceRuntimeConfig {
  version: string
  environments: string
  defaultEnvironment: string
  services: ServiceImageOriginPair[]
}

export interface ServiceImageOriginPair {
  name: string
  imageOrigin: ImageOrigin
}

export interface ImageOrigin {
  registry: {
    image: string
  },
  source: {
    build: {
      context: string
      dockerfile: string
    },
    mergeProperties: {
      [key: string]: any
    }
  }
}
