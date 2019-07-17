import DockerOptions from './docker-options'

export default interface PgDumpOptions {
  docker?: DockerOptions
  target: string
  schemaOnly: boolean
}
