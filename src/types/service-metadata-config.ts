export interface ServiceMetadataConfig {
  version: string;
  environments: string[];
  defaultEnvironment: string;
  services: ServiceMetadata[];
}

export interface ServiceMetadata {
  name: string;
  repositoryUrl?: string;
  source: SourceOrigin;
}

// type SourceOrigin = 'internal' | 'external'

const enum SourceOrigin {
  INTERNAL = 'internal', EXTERNAL = 'external'
}
