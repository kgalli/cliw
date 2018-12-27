//import {execSync} from 'child_process'
//import {writeFileSync} from 'fs'
//import Bash from './bash-wrapper'
import {isEmpty} from 'lodash'

import DockerComposeConfig from './config'

export default class DockerComposeWrapper {
  shellWrapper: any
  config: DockerComposeConfig

  constructor(config: any, shellWrapper: any) {
    this.config = config
    this.shellWrapper = shellWrapper
  }

  build(options: object, services: Array<string>, environment: string) {
    const startOptions = isEmpty(options) ? '' : options.toString()
    const buildCmd = `build ${startOptions} ${services.join(' ')}`

    this.dockerComposeExec(buildCmd, environment)
  }

  start(options: object, services: Array<string>, environment: string) {
    const startOptions = isEmpty(options) ? '' : options.toString()
    const upNoStartCmd = `up --no-start ${services.join(' ')}`
    const startCmd = `start ${startOptions} ${services.join(' ')}`

    this.dockerComposeExec(upNoStartCmd, environment)
    this.dockerComposeExec(startCmd, environment)
  }

  stop(options: object, services: Array<string>, environment: string) {
    const startOptions = isEmpty(options) ? '' : options.toString()
    const stopCmd = `stop ${startOptions} ${services.join(' ')}`

    this.dockerComposeExec(stopCmd, environment)
  }

  restart(services: Array<string>, environment: string) {
    this.stop({}, services, environment)
    this.start({}, services, environment)
  }

  up(options: object, services: Array<string>, environment: string) {
    const upOptions = isEmpty(options) ? '' : options.toString()
    const upCmd = `up ${upOptions} ${services.join(' ')}`

    this.dockerComposeExec(upCmd, environment)
  }

  logs(options: object, services: Array<string>, environment: string) {
    const logsOptions = isEmpty(options) ? '' : options.toString()
    const logsCmd = `logs ${logsOptions} ${services.join(' ')}`

    this.dockerComposeExec(logsCmd, environment)
  }

  run(options: object, service: string, environment: string, cmd: string) {
    const runOptions = isEmpty(options) ? '' : options.toString()
    const runCmd = `run ${runOptions} ${service} ${cmd}`

    this.dockerComposeExec(runCmd, environment)
  }

  exec(options: object, service: string, environment: string, cmd: string) {
    const execOptions = isEmpty(options) ? '' : options.toString()
    const execCmd = `exec ${execOptions} ${service} ${cmd}`

    this.dockerComposeExec(execCmd, environment)
  }

  status(options: object, services: Array<string>, environment: string) {
    const statusOptions = isEmpty(options) ? '' : options.toString()
    const statusCmd = `ps ${statusOptions} ${services.join(' ')}`

    this.dockerComposeExec(statusCmd, environment)
  }

  pull(options: object, services: Array<string>, environment: string) {
    const pullOptions = isEmpty(options) ? '' : options.toString()
    const pullCmd = `pull ${pullOptions} ${services.join(' ')}`

    this.dockerComposeExec(pullCmd, environment)
  }

  constructDockerComposeCmd(projectName: string, configFile: string, cmd: string) {
    return `docker-compose -p ${projectName} -f ${configFile} ${cmd}`
  }
  dockerComposeExec(cmd: string, environment: string) {
    const workDir = this.config.workDir
    const configFile = `${workDir}/docker-compose.${environment}.yaml`
    const projectName = this.config.projectName

    let dcCmd = cmd.replace('  ', ' ')

    dcCmd = this.constructDockerComposeCmd(projectName, configFile, dcCmd)

    //this.config.writeConfig(configFile, environment)
    this.shellWrapper.run(dcCmd)
  }
}
