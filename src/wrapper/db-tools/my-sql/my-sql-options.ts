import DockerOptions from '../docker-options'

export default interface MySqlOptions {
  docker?: DockerOptions
  command: string
}
