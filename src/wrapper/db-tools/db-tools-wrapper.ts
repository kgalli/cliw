import {isEmpty} from 'lodash'

import {Environment, EnvironmentVariable, Service} from '../../config/main-config'

import ConnectionParams from './connection-params'
import DockerOptions from './docker-options'
import PostgreSql from './postgre-sql'

export default class DbToolsWrapper {
  shellWrapper: any
  services: Service[]
  workDir: string
  projectName: string
  dryRun: boolean

  constructor(projectName: string, workDir: string, services: Service[], dryRun: boolean, shellWrapper: any) {
    this.projectName = projectName
    this.workDir = workDir
    this.services = services
    this.dryRun = dryRun
    this.shellWrapper = shellWrapper
  }

  serviceByName(name: string) {
    return this.services.find((s: Service) => s.name === name) as Service
  }

  serviceNames(): string[] {
    return this.services.map(s => s.name)
  }

  validate(serviceName: string) {
    if (isEmpty(serviceName)) {
      throw new Error('Missing required services')
    }

    if (!this.serviceNames().includes(serviceName)) {
      throw new Error(`Expected service ${serviceName} to be one of: ${this.serviceNames()}`)
    }
  }

  console(options: any, serviceName: string, environment: string) {
    this.validate(serviceName)
    const service = this.serviceByName(serviceName)
    const connectionParams = this.extractConnectionParams(service, environment)
    const dockerOptions = {enabled: true} as DockerOptions
    const dbWrapper = this.dbWrapper(connectionParams, dockerOptions)

    const dbConsoleCmd = dbWrapper.dbConsole()
    this.cmdExec(dbConsoleCmd)
  }

  private dbWrapper(connectionParams: ConnectionParams, dockerOptions: DockerOptions): PostgreSql {
    return new PostgreSql(connectionParams, dockerOptions)
  }

  private extractConnectionParams(service: Service, environment: string): ConnectionParams {
    const serviceEnvironment = service.environments[environment].environment as any
    const host = serviceEnvironment.DB_HOST as string
    const port = serviceEnvironment.DB_PORT as number
    const database = serviceEnvironment.DB_DATABASE as string
    const user = serviceEnvironment.DB_USER as string
    const password = serviceEnvironment.DB_PASSWORD as string

    return { host,
      port,
      user,
      password,
      database
    } as ConnectionParams
  }

  private extractDbHost(): string {
    // TODO check docker config and return localhost if depends_on is found in docker config
    return '127.0.0.1'
  }

  private extractDbPort(): number {
    // TODO check docker config and get local port if depends_on is found in docker config
    return 9999
  }

  cmdExec(cmd: string) {
    // tslint:disable-next-line no-console
    console.log(`${cmd}`)
    this.shellWrapper.run(cmd)
  }

}
