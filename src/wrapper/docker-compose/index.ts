import {isEmpty} from 'lodash'

import {CodeSource, Service} from '../../config/main-config-repo'

export default class DockerComposeWrapper {
  shellWrapper: any
  services: Service[]
  workDir: string
  projectName: string

  constructor(projectName: string, workDir: string, services: Service[], shellWrapper: any) {
    this.projectName = projectName
    this.workDir = workDir
    this.services = services
    this.shellWrapper = shellWrapper
  }

  serviceNames(): string[] {
    return this.services.map(s => s.name)
  }

  internalServiceNames() {
    return this.services
      .filter(s => s.source === CodeSource.internal)
      .map(s => s.name)
  }

  externalServiceNames() {
    return this.services
      .filter(s => s.source === CodeSource.external)
      .map(s => s.name)
  }

  validate(serviceNames: string[]) {
    if (isEmpty(serviceNames)) {
      throw new Error('Missing required services')
    }

    serviceNames.forEach((service: string) => {
      if (!this.serviceNames().includes(service)) {
        throw new Error(`Expected service ${service} to be one of: ${this.serviceNames()}`)
      }
    })
  }

  build(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const startOptions = isEmpty(options) ? '' : options.toString()
    const buildCmd = `build ${startOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(buildCmd, environment)
  }

  start(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const startOptions = isEmpty(options) ? '' : options.toString()
    const upNoStartCmd = `up --no-start ${serviceNames.join(' ')}`
    const startCmd = `start ${startOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(upNoStartCmd, environment)
    this.dockerComposeExec(startCmd, environment)
  }

  stop(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const startOptions = isEmpty(options) ? '' : options.toString()
    const stopCmd = `stop ${startOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(stopCmd, environment)
  }

  restart(serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    this.stop({}, serviceNames, environment)
    this.start({}, serviceNames, environment)
  }

  up(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const upOptions = isEmpty(options) ? '' : options.toString()
    const upCmd = `up ${upOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(upCmd, environment)
  }

  logs(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const logsOptions = isEmpty(options) ? '' : options.toString()
    const logsCmd = `logs ${logsOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(logsCmd, environment)
  }

  run(options: object, serviceName: string, environment: string, cmd: string) {
    this.validate([serviceName])

    const runOptions = isEmpty(options) ? '' : options.toString()
    const runCmd = `run ${runOptions} ${serviceName} ${cmd}`

    this.dockerComposeExec(runCmd, environment)
  }

  exec(options: object, serviceName: string, environment: string, cmd: string) {
    this.validate([serviceName])

    const execOptions = isEmpty(options) ? '' : options.toString()
    const execCmd = `exec ${execOptions} ${serviceName} ${cmd}`

    this.dockerComposeExec(execCmd, environment)
  }

  status(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const statusOptions = isEmpty(options) ? '' : options.toString()
    const statusCmd = `ps ${statusOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(statusCmd, environment)
  }

  pull(options: object, serviceNames: string[], environment: string) {
    this.validate(serviceNames)

    const pullOptions = isEmpty(options) ? '' : options.toString()
    const pullCmd = `pull ${pullOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(pullCmd, environment)
  }

  constructDockerComposeCmd(projectName: string, configFile: string, cmd: string) {
    return `docker-compose -p ${projectName} -f ${configFile} ${cmd}`
  }
  dockerComposeExec(cmd: string, environment: string) {
    const workDir = this.workDir
    const configFile = `${workDir}/docker-compose.${environment}.yaml`
    const projectName = this.projectName

    let dcCmd = cmd.replace('  ', ' ').trim()

    dcCmd = this.constructDockerComposeCmd(projectName, configFile, dcCmd)

    //this.config.writeConfig(configFile, environment)
    this.shellWrapper.run(dcCmd)
  }
}
