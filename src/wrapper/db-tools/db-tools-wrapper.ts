import {address} from 'ip'
import {isEmpty} from 'lodash'

import AwsKmsClient from '../../aws-kms'
import {DataSource, DataSourceParams} from '../../config/main-config/db-tools'

import ConnectionParams from './connection-params'
import DockerOptions from './docker-options'
import PgdumpOptions from './pgdump-options'
import PgRestoreOptions from './pgrestore-options'
import PostgreSql from './postgre-sql'

export default class DbToolsWrapper {
  shellWrapper: any
  dataSources: DataSource[]
  dryRun: boolean

  constructor(dataSources: DataSource[], dryRun: boolean, shellWrapper: any) {
    this.dataSources = dataSources
    this.dryRun = dryRun
    this.shellWrapper = shellWrapper
  }

  async console(options: any, dataSourceName: string, environment: string) {
    return this.runDbCmd(dataSourceName, environment, 'console', options)
  }

  async create(dataSourceName: string, environment: string) {
    return this.runDbCmd(dataSourceName, environment, 'create', null)
  }

  async drop(dataSourceName: string, environment: string) {
    return this.runDbCmd(dataSourceName, environment, 'drop', null)
  }

  async dump(options: PgdumpOptions, dataSourceName: string, environment: string) {
    return this.runDbCmd(dataSourceName, environment, 'dump', options)
  }

  async restore(options: PgRestoreOptions, dataSourceName: string, environment: string) {
    return this.runDbCmd(dataSourceName, environment, 'restore', options)
  }

  private dataSourceByName(name: string) {
    return this.dataSources.find((c: DataSource) => c.name === name) as DataSource
  }

  private dataSourceNames(): string[] {
    return this.dataSources.map(s => s.name)
  }

  private validate(dataSourceName: string) {
    if (isEmpty(dataSourceName)) {
      throw new Error('Missing required dataSourceName')
    }

    if (!this.dataSourceNames().includes(dataSourceName)) {
      throw new Error(`Expected service ${dataSourceName} to be one of: ${this.dataSourceNames()}`)
    }
  }

  private async runDbCmd(dataSourceName: string, environment: string, cmd: string, options: any) {
    this.validate(dataSourceName)
    const dataSource = this.dataSourceByName(dataSourceName)
    const dataSourceParams = this.extractDataSourceParams(dataSource, environment)

    let sshCmdTemplate = ''

    if (this.sshConnectionRequired(dataSourceParams)) {
      const sshConnectionParams = dataSourceParams.ssh!
      const localHostIp = address()
      const localPort = sshConnectionParams.localPort
      const jumpHost = sshConnectionParams.jumpHost
      const remoteHost = dataSourceParams.host
      const remotePort = dataSourceParams.port

      dataSourceParams.host = localHostIp
      dataSourceParams.port = localPort

      sshCmdTemplate = `ssh -l $USER ${jumpHost} -f -o ExitOnForwardFailure=yes -L ${localHostIp}:${localPort}:${remoteHost}:${remotePort} sleep 10; eval "@@"`

      if (!isEmpty(dataSourceParams.ssh!.beforeShellCmd)) {
        const beforeShellCmd = dataSourceParams.ssh!.beforeShellCmd
        sshCmdTemplate = `${beforeShellCmd} && ${sshCmdTemplate}`
      }
    }

    if (this.passwordDecryptionRequired(dataSourceParams)) {
      const client = new AwsKmsClient({})

      dataSourceParams.password = await client.decrypt(dataSourceParams.password) as string
    }

    const connectionParams = this.extractConnectionParams(dataSourceParams)
    const dockerOptions = {enabled: true, tty: Boolean(process.stdout.isTTY)} as DockerOptions
    const dbWrapper = this.dbWrapper(connectionParams, dockerOptions)

    let shellCmdToExec

    switch (cmd) {
    case 'console':
      shellCmdToExec = dbWrapper.dbConsole(options)
      break
    case 'create':
      this.raiseReadOnlyErrorIfNeeded(dataSourceParams, cmd)
      shellCmdToExec = dbWrapper.dbCreate()
      break
    case 'drop':
      this.raiseReadOnlyErrorIfNeeded(dataSourceParams, cmd)
      shellCmdToExec = dbWrapper.dbDrop()
      break
    case 'dump':
      shellCmdToExec = dbWrapper.dbDump(options)
      break
    case 'restore':
      this.raiseReadOnlyErrorIfNeeded(dataSourceParams, cmd)
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

  private raiseReadOnlyErrorIfNeeded(dataSourceParams: DataSourceParams, cmd: string) {
    // tslint:disable-next-line
    if (dataSourceParams.readonly === undefined || dataSourceParams.readonly === null || dataSourceParams.readonly) {
      throw new Error(`Command "${cmd}" is not supported in a readonly connection -- check your configuration`)
    }
  }

  private dbWrapper(connectionParams: ConnectionParams, dockerOptions: DockerOptions): PostgreSql {
    return new PostgreSql(connectionParams, dockerOptions)
  }

  private extractConnectionParams(dataSourceParams: DataSourceParams): ConnectionParams {
    let host = dataSourceParams.host as string
    let port = dataSourceParams.port as number
    const database = dataSourceParams.database as string
    const user = dataSourceParams.user as string
    const password = dataSourceParams.password as string

    return { host,
      port,
      user,
      password,
      database
    } as ConnectionParams
  }

  private extractDataSourceParams(dataSource: DataSource, environment: string): DataSourceParams {
    const dataSourceParams = dataSource.environments[environment]

    if (isEmpty(dataSourceParams)) {
      throw new Error(`Connection params for environment "${environment}" not set`)
    }

    return dataSourceParams
  }

  private sshConnectionRequired(dataSourceParams: DataSourceParams) {
    return !isEmpty(dataSourceParams.ssh)
  }

  private passwordDecryptionRequired(dataSourceParams: DataSourceParams) {
    if (!dataSourceParams.passwordEncryption || dataSourceParams.passwordEncryption === 'none') {
      return false
    }

    if (dataSourceParams.passwordEncryption === 'awskms') {
      return true
    }

    throw new Error(`Unsupported password decryption for ${dataSourceParams.passwordEncryption} encryption type. Only AWS KMS ('awskms') is currently supported.`)
  }
}
