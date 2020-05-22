export interface DockerComposeConfig {
  version: string
  services: {
    [key: string]: any
  }
}
