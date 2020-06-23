import {
  ExecOptions,
  LogOptions, PullOptions,
  RunOptions,
  StartOptions,
  StatusOptions,
  StopOptions,
} from '../../../types'

interface CmdWrapper {
  subCmd: string
  options: string[]
  services: string[]
  serviceCmd?: string
}

export default class DockerComposeCmdConstructor {
  project: string
  configFileLocation: string

  constructor(project: string, configFileLocation: string) {
    this.project = project
    this.configFileLocation = configFileLocation
  }

  exec(options: ExecOptions, service: string, cmd: string): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'exec',
      options: [],
      services: [service],
      serviceCmd: cmd,
    }

    if (options.noTty) {
      cmdWrapper.options.push('--no-tty')
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  log(options: LogOptions, services: string[]): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'logs',
      options: [],
      services,
    }

    if (options.follow) {
      cmdWrapper.options.push('--follow')
    }

    if (options.timestamps) {
      cmdWrapper.options.push('--timestamps')
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  run(options: RunOptions, service: string, cmd: string): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'run',
      options: [],
      services: [service],
      serviceCmd: cmd,
    }

    if (options.noTty) {
      cmdWrapper.options.push('--no-tty')
    }

    if (options.entrypoint) {
      cmdWrapper.options.push(`--entrypoint ${options.entrypoint}`)
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  start(options: StartOptions, services: string[]): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'up',
      options: [],
      services,
    }

    cmdWrapper.options.push('--detach')
    cmdWrapper.options.push('--build')
    cmdWrapper.options.push('--remove-orphans')

    if (!options.build) {
      cmdWrapper.options.push('--no-build')
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  stop(options: StopOptions, services: string[]): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'stop',
      options: [],
      services,
    }

    if (options.timeout) {
      cmdWrapper.options.push(`--timeout ${options.timeout}`)
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  status(options: StatusOptions, services: string[]): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'ps',
      options: [],
      services,
    }

    if (options.showAll) {
      cmdWrapper.options.push('--all')
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  pull(options: PullOptions, services: string[]): string {
    const cmdWrapper: CmdWrapper = {
      subCmd: 'pull',
      options: [],
      services,
    }

    if (options.quiet) {
      cmdWrapper.options.push('--quiet')
    }

    if (options.includeDeps) {
      cmdWrapper.options.push('--include-deps')
    }

    return this.constructDockerComposeCmd(cmdWrapper)
  }

  private constructDockerComposeCmd(cmdWrapper: CmdWrapper): string {
    const dockerComposeCmd = []

    dockerComposeCmd.push('docker-compose')
    dockerComposeCmd.push(`-p ${this.project}`)
    dockerComposeCmd.push((`-f ${this.configFileLocation}`))
    dockerComposeCmd.push(cmdWrapper.subCmd)

    if (cmdWrapper.options.length > 0) {
      dockerComposeCmd.push(cmdWrapper.options.join(' '))
    }

    dockerComposeCmd.push(cmdWrapper.services.join(' '))

    if (cmdWrapper.serviceCmd) {
      dockerComposeCmd.push(cmdWrapper.serviceCmd)
    }

    return dockerComposeCmd.join(' ')
  }
}
