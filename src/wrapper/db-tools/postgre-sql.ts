import ConnectionParams from './connection-params'
import DockerOptions from './docker-options'
import PsqlOptions from './psql-options'

const DOCKER_VOLUME = '/opt'

export default class PostgreSql {
  static psql(connectionParams: ConnectionParams, options: PsqlOptions) {
    const cmd = []

    cmd.push('psql')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)

    if (connectionParams.database) {
      cmd.push(`-d ${connectionParams.database}`)
    }

    if (options.command) {
      cmd.push(`-c ${options.command}`)
    }

    if (options.docker.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, options.docker.volume || DOCKER_VOLUME)
    }

    return cmd.join(' ')
  }

  static pgDump(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    const cmd = []
    const schemaOnly = false

    cmd.push('pg_dump')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)
    cmd.push('--verbose --no-security-labels --no-owner --if-exists --clean --no-tablespaces --no-privileges')

    if (schemaOnly) {
      cmd.push('--schema-only')
    } else {
      cmd.push('--format=custom')
    }

    //cmd.push("--file #{file}")
    cmd.push(`-d ${connectionParams.database}`)

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions.volume || DOCKER_VOLUME)
    }

    return cmd.join(' ')
  }

  static pgRestore(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('pg_restore')
    cmd.push('pg_dump')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)
    cmd.push('--verbose --no-owner --no-privileges --format=custom')
    cmd.push(`-d ${connectionParams.database}`)

    //  ? "#{docker_options[:volume]}/#{params[:file]}" : params[
    //cmd.push("#{file}")

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

  dbConsole(options: PsqlOptions) {
    const psqlOptions = {...options}

    psqlOptions.docker = this.dockerOptions

    return PostgreSql.psql(this.connectionParams, psqlOptions)
  }

  dbCreate() {
    const connectionParams = {...this.connectionParams}
    const createStatement = `"CREATE DATABASE ${connectionParams.database} WITH OWNER ${connectionParams.user} ENCODING 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';"`
    const psqlOptions = {command: createStatement, docker: this.dockerOptions}

    connectionParams.database = 'template1'
    return PostgreSql.psql(connectionParams, psqlOptions)
  }

  dbDrop() {
    const connectionParams = {...this.connectionParams}
    const dropStatement = `"DROP DATABASE IF EXISTS ${connectionParams.database};"`
    const psqlOptions = {command: dropStatement, docker: this.dockerOptions}

    connectionParams.database = 'template1'
    return PostgreSql.psql(connectionParams, psqlOptions)
  }

  /*
  dbRestore() {
    return PostgreSql.psql(this.connectionParams, this.dockerOptions)
  }

  dbDump() {
    return PostgreSql.psql(this.connectionParams, this.dockerOptions)
  }
  */
}
