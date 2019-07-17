import {isEmpty} from 'lodash'

import {Connection} from '../../config/main-config'

import ConnectionParams from './connection-params'
import DockerOptions from './docker-options'
import PostgreSql from './postgre-sql'

export default class DbToolsWrapper {
  shellWrapper: any
  connections: Connection[]
  dryRun: boolean

  constructor(connections: Connection[], dryRun: boolean, shellWrapper: any) {
    this.connections = connections
    this.dryRun = dryRun
    this.shellWrapper = shellWrapper
  }

  // tslint:disable-next-line no-unused
  console(options: any, connectionName: string, environment: string) {
    this.validate(connectionName)
    const service = this.connectionByName(connectionName)
    const connectionParams = this.extractConnectionParams(service, environment)
    const dockerOptions = {enabled: true} as DockerOptions
    const dbWrapper = this.dbWrapper(connectionParams, dockerOptions)

    const dbConsoleCmd = dbWrapper.dbConsole(options)
    this.cmdExec(dbConsoleCmd)
  }

  create(connectionName: string, environment: string) {
    this.validate(connectionName)
    const service = this.connectionByName(connectionName)
    const connectionParams = this.extractConnectionParams(service, environment)
    const dockerOptions = {enabled: true} as DockerOptions
    const dbWrapper = this.dbWrapper(connectionParams, dockerOptions)

    const dbConsoleCmd = dbWrapper.dbCreate()
    this.cmdExec(dbConsoleCmd)
  }

  drop(connectionName: string, environment: string) {
    this.validate(connectionName)
    const service = this.connectionByName(connectionName)
    const connectionParams = this.extractConnectionParams(service, environment)
    const dockerOptions = {enabled: true} as DockerOptions
    const dbWrapper = this.dbWrapper(connectionParams, dockerOptions)

    const dbConsoleCmd = dbWrapper.dbDrop()
    this.cmdExec(dbConsoleCmd)
  }

  dump(options: any, connectionName: string, environment: string) {
    this.validate(connectionName)
    const service = this.connectionByName(connectionName)
    const connectionParams = this.extractConnectionParams(service, environment)
    const dockerOptions = {enabled: true} as DockerOptions
    const dbWrapper = this.dbWrapper(connectionParams, dockerOptions)

    const dbDumpCmd = dbWrapper.dbDump(options)
    this.cmdExec(dbDumpCmd)
  }

  private connectionByName(name: string) {
    return this.connections.find((c: Connection) => c.name === name) as Connection
  }

  private connectionNames(): string[] {
    return this.connections.map(s => s.name)
  }

  private validate(connectionName: string) {
    if (isEmpty(connectionName)) {
      throw new Error('Missing required connectionName')
    }

    if (!this.connectionNames().includes(connectionName)) {
      throw new Error(`Expected service ${connectionName} to be one of: ${this.connectionNames()}`)
    }
  }

  private cmdExec(cmd: string) {
    this.shellWrapper.run(cmd)
  }

  private dbWrapper(connectionParams: ConnectionParams, dockerOptions: DockerOptions): PostgreSql {
    return new PostgreSql(connectionParams, dockerOptions)
  }

  private extractConnectionParams(connection: Connection, environment: string): ConnectionParams {
    const connectionParams = connection.environments[environment]

    if (isEmpty(connectionParams)) {
      throw new Error(`Connection params for environment "${environment}" not set`)
    }

    const host = connectionParams.host as string
    const port = connectionParams.port as number
    const database = connectionParams.database as string
    const user = connectionParams.user as string
    const password = connectionParams.password as string

    return { host,
      port,
      user,
      password,
      database
    } as ConnectionParams
  }
}
