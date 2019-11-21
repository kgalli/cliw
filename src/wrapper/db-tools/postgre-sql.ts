import ConnectionParams from './connection-params'
import DockerOptions from './docker-options'
import PgDumpOptions from './pgdump-options'
import PgRestoreOptions from './pgrestore-options'
import PsqlOptions from './psql-options'

const defaultDockerOptions: DockerOptions = {
  enabled: true,
  volume: '/opt'
}

function stripEnclosingDoubleQuotes(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.substr(1, value.length)
  }

  return value
}

export default class PostgreSql {
  static psql(connectionParams: ConnectionParams, options: PsqlOptions) {
    const dockerOptions = {...defaultDockerOptions, ...options.docker}
    const cmd = []

    cmd.push('psql')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)

    if (connectionParams.database) {
      cmd.push(`-d ${connectionParams.database}`)
    }

    if (options.command) {
      cmd.push(`-c "${stripEnclosingDoubleQuotes(options.command)}"`)
    }

    if (options.file) {
      cmd.push(`-f "${stripEnclosingDoubleQuotes(options.file)}"`)
    }

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions.volume)
    }

    return cmd.join(' ')
  }

  static pgDump(connectionParams: ConnectionParams, options: PgDumpOptions) {
    const dockerOptions = {...defaultDockerOptions, ...options.docker}
    const cmd = []

    cmd.push('pg_dump')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)
    cmd.push('--verbose --no-security-labels --no-owner --if-exists --clean --no-tablespaces --no-privileges --disable-dollar-quoting')

    if (options.schemaOnly) {
      cmd.push('--schema-only')
    } else {
      cmd.push('--format=custom')
    }

    cmd.push(`--file ${options.target}`)
    cmd.push(`-d ${connectionParams.database}`)

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions.volume)
    }

    return cmd.join(' ')
  }

  static pgRestore(connectionParams: ConnectionParams, options: PgRestoreOptions) {
    const dockerOptions = {...defaultDockerOptions, ...options.docker}
    const cmd = []

    cmd.push('pg_restore')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)
    cmd.push('--verbose --no-owner --no-privileges --format=custom')
    cmd.push(`-d ${connectionParams.database}`)

    cmd.push(options.restoreFileLocation)

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions.volume)
    }

    return cmd.join(' ')
  }

  private static asDockerCmd(dbCmd: string, password: string, volume: string) {
    const dockerRunOptions = []

    dockerRunOptions.push('--rm')
    dockerRunOptions.push('-it')
    dockerRunOptions.push('--net=host')
    dockerRunOptions.push(`-e PGPASSWORD=${password}`)
    dockerRunOptions.push(`-v $PWD:${volume}`)
    dockerRunOptions.push(`-w ${volume}`)

    return `docker run ${dockerRunOptions.join(' ')} postgres ${dbCmd}`
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
    const createStatement = `CREATE DATABASE ${connectionParams.database} WITH OWNER ${connectionParams.user} ENCODING 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';`
    const psqlOptions = {command: createStatement, docker: this.dockerOptions}

    connectionParams.database = 'template1'
    return PostgreSql.psql(connectionParams, psqlOptions)
  }

  dbDrop() {
    const connectionParams = {...this.connectionParams}
    const dropStatement = `DROP DATABASE IF EXISTS ${connectionParams.database};`
    const psqlOptions = {command: dropStatement, docker: this.dockerOptions}

    connectionParams.database = 'template1'
    return PostgreSql.psql(connectionParams, psqlOptions)
  }

  dbRestore(options: PgRestoreOptions) {
    const connectionParams = {...this.connectionParams}
    const pgRestoreOptions = {...options, docker: this.dockerOptions}

    return PostgreSql.pgRestore(connectionParams, pgRestoreOptions)
  }

  dbDump(options: PgDumpOptions) {
    const connectionParams = {...this.connectionParams}
    const pgDumpOptions = {...options, docker: this.dockerOptions}

    return PostgreSql.pgDump(connectionParams, pgDumpOptions)
  }
}
