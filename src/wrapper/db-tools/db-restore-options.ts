import DockerOptions from './docker-options'

export default interface DbRestoreOptions {
  docker?: DockerOptions
  restoreFileLocation: string
}
