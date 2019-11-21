import DockerOptions from './docker-options'

export default interface PsqlOptions {
  docker?: DockerOptions
  command?: string
  file?: string
}
