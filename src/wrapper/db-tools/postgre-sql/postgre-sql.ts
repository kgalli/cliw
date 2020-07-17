import ConnectionParams from '../connection-params'
import DbConsoleOptions from '../db-console-options'
import DbDumpOptions from '../db-dump-options'
import DbRestoreOptions from '../db-restore-options'
import DockerOptions from '../docker-options'

const defaultDockerOptions: DockerOptions = {
  enabled: true,
  volume: '/opt',
  tty: false,
  interactive: false,
}

function stripEnclosingDoubleQuotes(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.substr(1, value.length)
  }

  return value
}

export default class PostgreSql {
  static console(connectionParams: ConnectionParams, dbConsoleOptions: DbConsoleOptions, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('psql')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)

    if (connectionParams.database) {
      cmd.push(`-d ${connectionParams.database}`)
    }

    if (dbConsoleOptions.command) {
      cmd.push(`-c "${stripEnclosingDoubleQuotes(dbConsoleOptions.command)}"`)
    }

    if (dbConsoleOptions.file) {
      cmd.push(`-f "${stripEnclosingDoubleQuotes(dbConsoleOptions.file)}"`)
    }

    if (dockerOptions.enabled) {
      const changedDockerOptions = {...dockerOptions}

      if (dbConsoleOptions.file || dbConsoleOptions.command) {
        changedDockerOptions.tty = false
        changedDockerOptions.interactive = false
      } else {
        changedDockerOptions.interactive = true
      }

      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, changedDockerOptions)
    }

    return cmd.join(' ')
  }

  static pgDump(connectionParams: ConnectionParams, dbDumpOptions: DbDumpOptions, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('pg_dump')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)
    cmd.push('--verbose --no-security-labels --no-owner --if-exists --clean --no-tablespaces --no-privileges --disable-dollar-quoting')

    if (dbDumpOptions.schemaOnly) {
      cmd.push('--schema-only')
    } else {
      cmd.push('--format=custom')
    }

    cmd.push(`--file ${dbDumpOptions.target}`)
    cmd.push(`-d ${connectionParams.database}`)

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions)
    }

    return cmd.join(' ')
  }

  static pgRestore(connectionParams: ConnectionParams, dbRestoreOptions: DbRestoreOptions, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('pg_restore')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-p ${connectionParams.port}`)
    cmd.push(`-U ${connectionParams.user}`)
    cmd.push('--verbose --no-owner --no-privileges --format=custom')
    cmd.push(`-d ${connectionParams.database}`)

    cmd.push(dbRestoreOptions.restoreFileLocation)

    if (dockerOptions.enabled) {
      return PostgreSql.asDockerCmd(cmd.join(' '), connectionParams.password, dockerOptions)
    }

    return cmd.join(' ')
  }

  private static asDockerCmd(dbCmd: string, password: string, options: DockerOptions) {
    const dockerRunOptions = []

    dockerRunOptions.push('--rm')

    if (options.interactive) {
      dockerRunOptions.push('-i')
    }

    if (options.tty) {
      dockerRunOptions.push('-t')
    }

    dockerRunOptions.push('--net=host')
    dockerRunOptions.push(`-e PGPASSWORD=${password}`)
    dockerRunOptions.push(`-v $PWD:${options.volume}`)
    dockerRunOptions.push(`-w ${options.volume}`)

    return `docker run ${dockerRunOptions.join(' ')} postgres ${dbCmd}`
  }

  readonly connectionParams: ConnectionParams

  readonly dockerOptions: DockerOptions

  constructor(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    this.connectionParams = connectionParams
    this.dockerOptions = {...defaultDockerOptions, ...dockerOptions}
  }

  dbConsole(options: DbConsoleOptions) {
    return PostgreSql.console(this.connectionParams, options, this.dockerOptions)
  }

  dbCreate() {
    const connectionParams = {...this.connectionParams}
    const createStatement = `CREATE DATABASE ${connectionParams.database} WITH OWNER ${connectionParams.user} ENCODING 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';`
    const dbConsoleOptions: DbConsoleOptions = {command: createStatement}

    connectionParams.database = 'template1'
    return PostgreSql.console(connectionParams, dbConsoleOptions, this.dockerOptions)
  }

  dbDrop() {
    const connectionParams = {...this.connectionParams}
    const dropStatement = `DROP DATABASE IF EXISTS ${connectionParams.database};`
    const dbConsoleOptions: DbConsoleOptions = {command: dropStatement}

    connectionParams.database = 'template1'
    return PostgreSql.console(connectionParams, dbConsoleOptions, this.dockerOptions)
  }

  dbRestore(dbRestoreOptions: DbRestoreOptions) {
    const connectionParams = {...this.connectionParams}

    return PostgreSql.pgRestore(connectionParams, dbRestoreOptions, this.dockerOptions)
  }

  dbDump(dbDumpOptions: DbDumpOptions) {
    const connectionParams = {...this.connectionParams}

    return PostgreSql.pgDump(connectionParams, dbDumpOptions, this.dockerOptions)
  }
}
