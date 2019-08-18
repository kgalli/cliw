import ConnectionParams from '../connection-params'
import DbDumpOptions from '../db-dump-options'
import DbRestoreOptions from '../db-restore-options'
import DockerOptions from '../docker-options'

import MySqlOptions from './my-sql-options'

const defaultDockerOptions: DockerOptions = {
  enabled: true,
  volume: '/opt'
}

export default class MySql {
  static mysql(connectionParams: ConnectionParams, options: MySqlOptions) {
    const dockerOptions = {...defaultDockerOptions, ...options.docker}
    const cmd = []

    cmd.push('mysql')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-P ${connectionParams.port}`)
    cmd.push(`-u ${connectionParams.user}`)
    cmd.push(`-p ${connectionParams.password}`)

    if (connectionParams.database) {
      cmd.push(`-D ${connectionParams.database}`)
    }

    if (options.command) {
      cmd.push(`-e ${options.command}`)
    }

    if (dockerOptions.enabled) {
      return MySql.asDockerCmd(cmd.join(' '), dockerOptions.volume)
    }

    return cmd.join(' ')
  }

  static mysqldump(connectionParams: ConnectionParams, options: DbDumpOptions) {
    const dockerOptions = {...defaultDockerOptions, ...options.docker}
    const cmd = []

    cmd.push('mysqldump')
    cmd.push(`-h ${connectionParams.host}`)
    cmd.push(`-P ${connectionParams.port}`)
    cmd.push(`-u ${connectionParams.user}`)
    cmd.push(`-p ${connectionParams.password}`)
    cmd.push('--verbose --no-security-labels --no-owner --if-exists --clean --no-tablespaces --no-privileges')

    if (options.schemaOnly) {
      cmd.push('--no-data')
    }

    cmd.push('--no-create-db --skip-comments --column-statistics=0')
    cmd.push(`--result-file=${options.target}`)
    cmd.push(`${connectionParams.database}`)

    if (dockerOptions.enabled) {
      return MySql.asDockerCmd(cmd.join(' '), dockerOptions.volume)
    }

    return cmd.join(' ')
  }

  static pgRestore(connectionParams: ConnectionParams, options: DbRestoreOptions) {
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
      return MySql.asDockerCmd(cmd.join(' '), dockerOptions.volume)
    }

    return cmd.join(' ')
  }

  private static asDockerCmd(dbCmd: string, volume: string) {
    const dockerRunOptions = []

    dockerRunOptions.push('--rm')
    dockerRunOptions.push('-it')
    dockerRunOptions.push('--net=host')
    dockerRunOptions.push(`-v $PWD:${volume}`)
    dockerRunOptions.push(`-w ${volume}`)

    return `docker run ${dockerRunOptions.join(' ')} mysql ${dbCmd}`
  }

  readonly connectionParams: ConnectionParams
  readonly dockerOptions: DockerOptions

  constructor(connectionParams: ConnectionParams, dockerOptions: DockerOptions) {
    this.connectionParams = connectionParams
    this.dockerOptions = dockerOptions
  }

  dbConsole(options: MySqlOptions) {
    const psqlOptions = {...options}

    psqlOptions.docker = this.dockerOptions

    return MySql.mysql(this.connectionParams, psqlOptions)
  }

  dbCreate() {
    const createStatement = `"CREATE SCHEMA ${this.connectionParams.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"`
    const mySqlOptions = {command: createStatement, docker: this.dockerOptions}

    return MySql.mysql(this.connectionParams, mySqlOptions)
  }

  dbDrop() {
    const dropStatement = `"DROP SCHEMA IF EXISTS ${this.connectionParams.database};"`
    const mySqlOptions = {command: dropStatement, docker: this.dockerOptions}

    return MySql.mysql(this.connectionParams, mySqlOptions)
  }

  dbRestore(options: DbRestoreOptions) {
    const connectionParams = {...this.connectionParams}
    const dbRestoreOptions = {...options, docker: this.dockerOptions}

    return MySql.pgRestore(connectionParams, dbRestoreOptions)
  }

  dbDump(options: DbDumpOptions) {
    const connectionParams = {...this.connectionParams}
    const dbDumpOptions = {...options, docker: this.dockerOptions}

    return MySql.mysqldump(connectionParams, dbDumpOptions)
  }
}
