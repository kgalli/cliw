export interface ServiceImageOriginTypesConfig {
  environments: EnvironmentServiceImageOriginTypesPair[]
}

interface EnvironmentServiceImageOriginTypesPair {
  name: string
  services: ServiceImageOriginTypePair[]
}

export interface ServiceImageOriginTypePair {
  name: string
  imageOriginType: ImageOriginType
}

export const enum ImageOriginType {
  SOURCE = 'source', REGISTRY = 'registry'
}
