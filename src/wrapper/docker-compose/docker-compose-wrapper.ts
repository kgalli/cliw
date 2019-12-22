import {writeFileSync} from 'fs'
import {safeDump} from 'js-yaml'
import {isEmpty} from 'lodash'

import {BuildOrigin, ServicesBuildOrigin} from '../../config/build-origins-config'
import {CodeSource, Service} from '../../config/main-config'

export default class DockerComposeWrapper {
  shellWrapper: any
  services: Service[]
  workDir: string
  projectName: string
  networkName: string
  dryRun: boolean
  servicesBuildOrigin: ServicesBuildOrigin

  constructor(projectName: string, networkName: string, workDir: string, services: Service[], servicesBuildOrigin: ServicesBuildOrigin, dryRun: boolean, shellWrapper: any) {
    this.projectName = projectName
    this.networkName = networkName
    this.workDir = workDir
    this.services = services
    this.dryRun = dryRun
    this.servicesBuildOrigin = servicesBuildOrigin
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

  build(options: any, serviceNames: string[], environment: string) {
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const startOptions = isEmpty(options) ? '' : options.toString()
    const buildCmd = `build ${startOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(buildCmd, environment)
  }

  start(options: object, serviceNames: string[], environment: string) {
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const startOptions = isEmpty(options) ? '' : options.toString()
    const upNoStartCmd = `up --no-start ${serviceNames.join(' ')}`
    const startCmd = `start ${startOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(upNoStartCmd, environment)
    this.dockerComposeExec(startCmd, environment)
  }

  stop(options: object, serviceNames: string[], environment: string) {
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const startOptions = isEmpty(options) ? '' : options.toString()
    const stopCmd = `stop ${startOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(stopCmd, environment)
  }

  restart(serviceNames: string[], environment: string) {
    this.stop({}, serviceNames, environment)
    this.start({}, serviceNames, environment)
  }

  up(options: object, serviceNames: string[], environment: string) {
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const upOptions = isEmpty(options) ? '' : options.toString()
    const upCmd = `up ${upOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(upCmd, environment)
  }

  logs(options: any, serviceNames: string[], environment: string) {
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const logsOptions = []

    if (!isEmpty(options)) {
      if (options.follow) {
        logsOptions.push('--follow')
      }
      if (options.timestamps) {
        logsOptions.push('--timestamps')
      }
    }

    const logsCmd = `logs ${logsOptions.join(' ')} ${serviceNames.join(' ')}`

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
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const statusOptions = isEmpty(options) ? '' : options.toString()
    const statusCmd = `ps ${statusOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(statusCmd, environment)
  }

  pull(options: object, serviceNames: string[], environment: string) {
    if (isEmpty(serviceNames)) {
      serviceNames = []
    } else {
      this.validate(serviceNames)
    }

    const pullOptions = isEmpty(options) ? '' : options.toString()
    const pullCmd = `pull ${pullOptions} ${serviceNames.join(' ')}`

    this.dockerComposeExec(pullCmd, environment)
  }

  dockerComposeExec(cmd: string, environment: string) {
    const configFile = this.constructConfigFilename(this.workDir, environment)
    const dcCmd = this.constructDockerComposeCmd(this.projectName, environment, configFile, this.sanitizeCmd(cmd))
    const dcConfig = this.constructDockerComposeConfig(this.projectName, this.networkName, environment, this.services)

    if (this.dryRun === false) {
      this.writeConfigFile(configFile, dcConfig)
    }
    this.shellWrapper.run(dcCmd)
  }

  private constructDockerComposeCmd(projectName: string, environment: string, configFile: string, cmd: string) {
    return `docker-compose -p ${projectName}_${environment} -f ${configFile} ${cmd}`
  }

  private writeConfigFile(fileLocation: string, data: any) {
    writeFileSync(fileLocation, safeDump(data))
  }

  private sanitizeCmd(cmd: string): string {
    return cmd.replace('  ', ' ').trim()
  }

  private constructConfigFilename(workDir: string, environment: string): string {
    return `${workDir}/docker-compose.${environment}.yaml`
  }

  private constructDockerComposeConfig(projectName: string, networkName: string, environment: string, services: Service[]): any {
    const servicesObject: any = {}

    services.forEach(s => {
      const defaultServiceConfig = s.environments.default
      const runFromSrc = this.servicesBuildOrigin[s.name][environment] === BuildOrigin.SOURCE
      const buildOrigin = runFromSrc ? defaultServiceConfig.buildOrigin.source : defaultServiceConfig.buildOrigin.registry
      const environmentServiceConfig: any = s.environments[environment]

      let serviceConfig = {
        container_name: this.constructContainerName(projectName, environment, s.name),
        ...buildOrigin,
        ...defaultServiceConfig,
      }

      if (isEmpty(environmentServiceConfig) === false) {
        serviceConfig = {...serviceConfig, ...environmentServiceConfig}
      }

      delete serviceConfig.buildOrigin

      servicesObject[s.name] = serviceConfig
    })

    return {
      version: '3',
      services: servicesObject,
      networks: {
        default: {
          external: {
            name: `${networkName}_${environment}`
          }
        }
      }
    }
  }

  private constructContainerName(projectName: string, environment: string, serviceName: string): string {
    return `${projectName}_${serviceName}_${environment}`
  }
}
