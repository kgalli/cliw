//import {execSync} from 'child_process'
//import {writeFileSync} from 'fs'
//import Bash from './bash-wrapper'
import {isEmpty} from 'lodash'

export default class DockerComposeWrapper {
  shellWrapper: any
  mainConfig: any

  constructor(mainConfig: any, shellWrapper: any) {
    this.mainConfig = mainConfig
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

  dockerComposeExec(cmd: string, environment: string) {
    const dockerComposeYaml = environment
    const dcCmd = `docker-compose ${cmd}`.replace('  ', ' ')

    //writeFileSync('./docker-compose.yaml', dockerComposeYaml)
    this.shellWrapper.run(dcCmd, environment)
  }
}
