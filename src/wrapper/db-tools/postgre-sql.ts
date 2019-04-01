import ConnectionParams from './connection-params'
import DockerOptions from './docker-options'

const DOCKER_VOLUME = '/opt'

export default class PostgreSql {
  static psql(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('psql')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)

    if (connectionParams.database) {
      cmd.push(`-d ${connectionParams.database}`)
    }

    if (connectionParams.command) {
      cmd.push(`-c ${connectionParams.command}`)
    }

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions.volume || DOCKER_VOLUME)
    }

    return cmd.join(' ')
  }

  private static asDockerCmd(dbCmd: string, password: string, volume: string) {
    const volumeOption = `-v $PWD:${volume || DOCKER_VOLUME}`

    return `docker run --rm -it --net=host -e PGPASSWORD=${password} ${volumeOption} postgres ${dbCmd}`
  }

  readonly connectionParams: ConnectionParams
  readonly dockerOptions: DockerOptions

  constructor(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    this.connectionParams = connectionParams
    this.dockerOptions = dockerOptions
  }

  dbConsole() {
    return PostgreSql.psql(this.connectionParams, this.dockerOptions)
  }
}
