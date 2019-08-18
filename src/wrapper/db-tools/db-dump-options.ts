import DockerOptions from './docker-options'

export default interface DbDumpOptions {
  docker?: DockerOptions
  target: string
  schemaOnly: boolean
}
