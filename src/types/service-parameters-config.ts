export interface ServiceParameterConfig {
  version: string;
  services: ServiceParametersPair[];
}

export interface ServiceParametersPair {
  name: string;
  parameters: Parameter[];
}

interface Parameter {
  name: string;
  value: string;
}
