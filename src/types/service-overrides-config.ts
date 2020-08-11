export interface ServiceOverridesConfig {
  version: string;
  services: {
    build: ServiceBuildConfig;
    [mergeProperties: string]: any;
  };
}

export interface ServiceBuildConfig {
  context: string;
  dockerfile: string;
  args?: KeyValue;
  cache_from?: string[];
  labels?: KeyValue;
  network?: string;
  shm_size?: string | number;
  target?: string;
}

interface KeyValue {
  [key: string]: string;
}
