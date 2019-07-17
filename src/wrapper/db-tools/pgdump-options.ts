import DockerOptions from './docker-options'

export default interface PgdumpOptions {
  docker?: DockerOptions
  target: string
  schemaOnly: boolean
}
