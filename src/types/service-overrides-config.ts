export interface ServiceOverridesConfig {
  version: string;
  services: ServiceOverrides;
}

export interface ServiceOverrides {
  [service: string]: ServiceOverride;
}

export interface ServiceOverride {
  build: ServiceBuildConfig;
  [override: string]: any;
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
