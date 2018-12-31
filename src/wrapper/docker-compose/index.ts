import {writeFileSync} from 'fs'
import {safeDump} from 'js-yaml'
import {isEmpty} from 'lodash'

import {CodeSource, Service} from '../../config/main-config-repo'

export default class DockerComposeWrapper {
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

  dockerComposeExec(cmd: string, environment: string) {
    const configFile = this.constructConfigFilename(this.workDir, environment)
    const dcCmd = this.constructDockerComposeCmd(this.projectName, configFile, this.sanitizeCmd(cmd))
    //TODO load runFromSrc from config
    const runFromSrc = false
    const dcConfig = this.constructDockerComposeConfig(this.projectName, environment, runFromSrc, this.services)

    if (this.dryRun === false) {
      this.writeConfigFile(configFile, safeDump(dcConfig))
    }
    this.shellWrapper.run(dcCmd)
  }

  private constructDockerComposeCmd(projectName: string, configFile: string, cmd: string) {
    return `docker-compose -p ${projectName} -f ${configFile} ${cmd}`
  }

  private writeConfigFile(fileLocation: string, data: any) {
    // TODO figure out why this hack is needed js-yaml should not add | instead of ---
    const yamlData = safeDump(data).replace('|', '---')
    writeFileSync(fileLocation, yamlData)
  }

  private sanitizeCmd(cmd: string): string {
    return cmd.replace('  ', ' ').trim()
  }

  private constructConfigFilename(workDir: string, environment: string): string {
    return `${workDir}/docker-compose.${environment}.yaml`
  }

  private constructDockerComposeConfig(projectName: string, environment: string, runFromSrc: boolean, services: Service[]): any {
    const servicesObject: any = {}

    services.forEach(s => {
      const defaultServiceConfig = s.environments.default
      const runType = runFromSrc ? defaultServiceConfig.runType.src : {image: defaultServiceConfig.runType.image}
      // @ts-ignore
      const environmentServiceConfig: any = s.environments[environment]

      let serviceConfig = {
        ...runType,
        ...defaultServiceConfig,
      }

      if (isEmpty(environmentServiceConfig) === false) {
        serviceConfig = {...serviceConfig, ...environmentServiceConfig}
      }

      delete serviceConfig.runType

      servicesObject[s.name] = serviceConfig
    })

    const config = {
      version: '3',
      services: servicesObject,
      networks: {
        default: {
          external: {
            name: `${projectName}_${environment}`
          }
        }
      }
    }

    return config
  }
}
