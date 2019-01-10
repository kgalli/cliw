import {isEmpty} from 'lodash'

import {Service} from '../../config/main-config'

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

  console(options: object, serviceName: string, environment: string) {
    this.validate(serviceName)

    this.cmdExec('console', environment)
  }

  cmdExec(cmd: string, environment: string) {
    // tslint:disable-next-line no-console
    console.log(`${cmd} ${environment}`)
    //this.shellWrapper.run(`${cmd} ${environment}`)
  }

}
