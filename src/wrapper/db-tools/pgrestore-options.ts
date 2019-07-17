import DockerOptions from './docker-options'

export default interface PgRestoreOptions {
  docker?: DockerOptions
  restoreFileLocation: string
}
