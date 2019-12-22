/*
{
  projectA: {
    api: { development: "source", test: "registry" },
    web: { development: "registry", test: "registry" }
  }
}
*/
export interface BuildOriginsConfig {
  [key: string]: ServicesBuildOrigin
}

export interface ServicesBuildOrigin {
  [key: string]: EnvironmentBuildOrigin
}

interface EnvironmentBuildOrigin {
  [key: string]: BuildOrigin
}

export const enum BuildOrigin {
  SOURCE = 'source', REGISTRY = 'registry'
}
