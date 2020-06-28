import {address} from 'ip'
import {isEmpty} from 'lodash'

import AwsKmsClient from '../../aws-kms'
import {DataSource, DbEngine} from '../../types/data-sources-config'

import ConnectionParams from './connection-params'
import DbConsoleOptions from './db-console-options'
import DbDumpOptions from './db-dump-options'
import DbRestoreOptions from './db-restore-options'
import DockerOptions from './docker-options'
import MySql from './my-sql/my-sql'
import PostgreSql from './postgre-sql/postgre-sql'

export default class DbToolsWrapper {
  shellWrapper: any
  dataSources: DataSource[]
  dryRun: boolean

  constructor(dataSources: DataSource[], dryRun: boolean, shellWrapper: any) {
    this.dataSources = dataSources
    this.dryRun = dryRun
    this.shellWrapper = shellWrapper
  }

  async console(options: DbConsoleOptions, dataSourceName: string) {
    return this.runDbCmd(dataSourceName, 'console', options)
  }

  async create(dataSourceName: string) {
    return this.runDbCmd(dataSourceName, 'create', null)
  }

  async drop(dataSourceName: string) {
    return this.runDbCmd(dataSourceName, 'drop', null)
  }

  async dump(options: DbDumpOptions, dataSourceName: string) {
    return this.runDbCmd(dataSourceName, 'dump', options)
  }

  async restore(options: DbRestoreOptions, dataSourceName: string) {
    return this.runDbCmd(dataSourceName, 'restore', options)
  }

  private dataSourceByName(name: string) {
    return this.dataSources.find((dataSource: DataSource) => dataSource.name === name) as DataSource
  }

  private dataSourceNames(): string[] {
    return this.dataSources.map(dataSource => dataSource.name)
  }

  private validate(dataSourceName: string) {
    if (isEmpty(dataSourceName)) {
      throw new Error('Missing required dataSourceName')
    }

    if (!this.dataSourceNames().includes(dataSourceName)) {
      throw new Error(`Expected service ${dataSourceName} to be one of: ${this.dataSourceNames()}`)
    }
  }

  private async runDbCmd(dataSourceName: string, cmd: string, options: any) {
    this.validate(dataSourceName)
    const dataSource = this.dataSourceByName(dataSourceName)

    let sshCmdTemplate = ''

    if (this.sshConnectionRequired(dataSource)) {
      const sshConnectionParams = dataSource.ssh!
      const localHostIp = address()
      const localPort = sshConnectionParams.localPort
      const jumpHost = sshConnectionParams.jumpHost
      const remoteHost = dataSource.host
      const remotePort = dataSource.port

      dataSource.host = localHostIp
      dataSource.port = localPort

      sshCmdTemplate = `ssh -l $USER ${jumpHost} -f -o ExitOnForwardFailure=yes -L ${localHostIp}:${localPort}:${remoteHost}:${remotePort} sleep 10; eval "@@"`

      if (!isEmpty(dataSource.ssh!.beforeShellCmd)) {
        const beforeShellCmd = dataSource.ssh!.beforeShellCmd
        sshCmdTemplate = `${beforeShellCmd} && ${sshCmdTemplate}`
      }
    }

    if (this.passwordDecryptionRequired(dataSource)) {
      const client = new AwsKmsClient({})

      dataSource.password = await client.decrypt(dataSource.password) as string
    }

    const connectionParams = this.extractConnectionParams(dataSource)
    const dockerOptions = {enabled: true, tty: Boolean(process.stdout.isTTY)} as DockerOptions
    const dbWrapper = this.dbWrapper(dataSource.engine, connectionParams, dockerOptions)

    let shellCmdToExec

    switch (cmd) {
    case 'console':
      shellCmdToExec = dbWrapper.dbConsole(options)
      break
    case 'create':
      this.raiseReadOnlyErrorIfNeeded(dataSource, cmd)
      shellCmdToExec = dbWrapper.dbCreate()
      break
    case 'drop':
      this.raiseReadOnlyErrorIfNeeded(dataSource, cmd)
      shellCmdToExec = dbWrapper.dbDrop()
      break
    case 'dump':
      shellCmdToExec = dbWrapper.dbDump(options)
      break
    case 'restore':
      this.raiseReadOnlyErrorIfNeeded(dataSource, cmd)
      shellCmdToExec = dbWrapper.dbRestore(options)
      break
    default:
      throw new Error(`Command "${cmd}" not support`)
    }

    shellCmdToExec = isEmpty(sshCmdTemplate) ? shellCmdToExec : sshCmdTemplate.replace('@@', shellCmdToExec)

    return this.runShellCmd(shellCmdToExec)
  }

  private runShellCmd(cmd: string) {
    this.shellWrapper.run(cmd)
  }

  private raiseReadOnlyErrorIfNeeded(dataSource: DataSource, cmd: string) {
    // tslint:disable-next-line
    if (dataSource.readonly === undefined || dataSource.readonly === null || dataSource.readonly) {
      throw new Error(`Command "${cmd}" is not supported in a readonly connection -- check your configuration`)
    }
  }

  private dbWrapper(engine: DbEngine, connectionParams: ConnectionParams, dockerOptions: DockerOptions): PostgreSql {
    let wrapper
    switch (engine) {
    case DbEngine.POSTGRES:
      wrapper = new PostgreSql(connectionParams, dockerOptions)
      break
    case DbEngine.MYSQL:
      wrapper = new MySql(connectionParams, dockerOptions)
      break
    default:
      throw new Error(`Engine "${engine}" is not supported`)
    }

    return wrapper
  }

  private extractConnectionParams(dataSource: DataSource): ConnectionParams {
    let host = dataSource.host as string
    let port = dataSource.port as number
    const database = dataSource.database as string
    const user = dataSource.user as string
    const password = dataSource.password as string

    return { host,
      port,
      user,
      password,
      database
    } as ConnectionParams
  }

  private sshConnectionRequired(dataSource: DataSource) {
    return !isEmpty(dataSource.ssh)
  }

  private passwordDecryptionRequired(dataSource: DataSource) {
    if (!dataSource.passwordEncryption || dataSource.passwordEncryption === 'none') {
      return false
    }

    if (dataSource.passwordEncryption === 'awskms') {
      return true
    }

    throw new Error(`Unsupported password decryption for ${dataSource.passwordEncryption} encryption type. Only AWS KMS ('awskms') is currently supported.`)
  }
}
