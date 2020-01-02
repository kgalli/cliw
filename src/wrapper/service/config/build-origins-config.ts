/*
{
  api: { development: "source", test: "registry" },
  web: { development: "registry", test: "registry" }
  }
}
*/
export interface BuildOriginConfig {
  [key: string]: Environment
}

interface Environment {
  [key: string]: BuildOrigin
}

export const enum BuildOrigin {
  SOURCE = 'source', REGISTRY = 'registry'
}
