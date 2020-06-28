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

export default class MySql {
  static console(connectionParams: ConnectionParams, dbConsoleOptions: DbConsoleOptions, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('mysql')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-P ${connectionParams.port}`)
    cmd.push(`-u ${connectionParams.user}`)
    cmd.push(`-p${connectionParams.password}`)

    if (connectionParams.database) {
      cmd.push(`-D ${connectionParams.database}`)
    }

    if (dbConsoleOptions.command) {
      cmd.push(`-e ${dbConsoleOptions.command}`)
    }

    if (dbConsoleOptions.file) {
      cmd.push(`< ${dbConsoleOptions.file}`)
    }

    if (dockerOptions.enabled) {
      const changedDockerOptions = {...dockerOptions}

      if (dbConsoleOptions.file || dbConsoleOptions.command) {
        changedDockerOptions.tty = false
      }

      changedDockerOptions.interactive = true

      return MySql.asDockerCmd(cmd.join(' '), changedDockerOptions)
    }

    return cmd.join(' ')
  }

  static mysqldump(connectionParams: ConnectionParams, dbDumpOptions: DbDumpOptions, dockerOptions: DockerOptions) {
    const cmd = []

    cmd.push('mysqldump')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-P ${connectionParams.port}`)
    cmd.push(`-u ${connectionParams.user}`)
    cmd.push(`-p${connectionParams.password}`)

    if (dbDumpOptions.schemaOnly) {
      cmd.push('--no-data')
    }

    cmd.push(`${connectionParams.database}`)
    cmd.push(`> ${dbDumpOptions.target}`)

    if (dockerOptions.enabled) {
      return MySql.asDockerCmd(cmd.join(' '), dockerOptions)
    }

    return cmd.join(' ')
  }

  static mysqlRestore(connectionParams: ConnectionParams, dbRestoreOptions: DbRestoreOptions, dockerOptions: DockerOptions) {
    const consoleOptions: DbConsoleOptions = {
      file: dbRestoreOptions.restoreFileLocation,
    }

    return MySql.console(connectionParams, consoleOptions, dockerOptions)
  }

  private static asDockerCmd(dbCmd: string, options: DockerOptions) {
    const dockerRunOptions = []

    dockerRunOptions.push('--rm')

    if (options.interactive) {
      dockerRunOptions.push('-i')
    }

    if (options.tty) {
      dockerRunOptions.push('-t')
    }

    dockerRunOptions.push('--net=host')
    dockerRunOptions.push(`-v $PWD:${options.volume}`)
    dockerRunOptions.push(`-w ${options.volume}`)

    return `docker run ${dockerRunOptions.join(' ')} mysql ${dbCmd}`
  }

  readonly connectionParams: ConnectionParams

  readonly dockerOptions: DockerOptions

  constructor(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    this.connectionParams = connectionParams
    this.dockerOptions = {...defaultDockerOptions, ...dockerOptions}
  }

  dbConsole(dbConsoleOptions: DbConsoleOptions) {
    return MySql.console(this.connectionParams, dbConsoleOptions, this.dockerOptions)
  }

  dbCreate() {
    const connectionParams = {...this.connectionParams}
    const createStatement = `"CREATE SCHEMA ${connectionParams.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"`
    const dbConsoleOptions: DbConsoleOptions = {command: createStatement}

    connectionParams.database = 'mysql'
    return MySql.console(connectionParams, dbConsoleOptions, this.dockerOptions)
  }

  dbDrop() {
    const connectionParams = {...this.connectionParams}
    const dropStatement = `"DROP SCHEMA IF EXISTS ${connectionParams.database};"`
    const mySqlOptions: DbConsoleOptions = {command: dropStatement}

    connectionParams.database = 'mysql'
    return MySql.console(this.connectionParams, mySqlOptions, this.dockerOptions)
  }

  dbRestore(options: DbRestoreOptions) {
    const connectionParams = {...this.connectionParams}

    return MySql.mysqlRestore(connectionParams, options, this.dockerOptions)
  }

  dbDump(options: DbDumpOptions) {
    const connectionParams = {...this.connectionParams}

    return MySql.mysqldump(connectionParams, options, this.dockerOptions)
  }
}
