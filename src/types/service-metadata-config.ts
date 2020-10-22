export interface ServiceMetadataConfig {
  version: string;
  environments: string[];
  defaultEnvironment: string;
  services: ServiceMetadata[];
}

export interface ServiceMetadata {
  name: string;
  repositoryUrl: string;
  directory: string;
  source: SourceOrigin;
}

// type SourceOrigin = 'internal' | 'external'

export const enum SourceOrigin {
  INTERNAL = 'internal', EXTERNAL = 'external'
}
