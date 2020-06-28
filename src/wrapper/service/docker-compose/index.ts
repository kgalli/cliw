import ServiceWrapper, {
  ExecOptions,
  LogOptions, PullOptions,
  RunOptions,
  ShellCallback,
  StartOptions,
  StatusOptions,
  StopOptions,
} from '../../../types'
import {DockerComposeConfig} from '../../../types/docker-compose-config'
import DockerComposeConfigRepo from '../config/docker-compose-config-repo'

import DockerComposeCmdConstructor from './cmd-constructer'
import DockerComposeConfigConstructor from './config-constructor'

export default class DockerComposeWrapper implements ServiceWrapper {
  workDir: string

  dockerComposeConfigName: string

  shellCallback: ShellCallback

  dockerComposeConfigConstructor: DockerComposeConfigConstructor

  dockerComposeCmdConstructor: DockerComposeCmdConstructor

  constructor(workDir: string,
    dockerComposeConfigName: string,
    dockerComposeCmdConstructor: DockerComposeCmdConstructor,
    dockerComposeConfigConstructor: DockerComposeConfigConstructor,
    shellCallback: ShellCallback,
  ) {
    this.workDir = workDir
    this.dockerComposeConfigName = dockerComposeConfigName
    this.shellCallback = shellCallback
    this.dockerComposeCmdConstructor = dockerComposeCmdConstructor
    this.dockerComposeConfigConstructor = dockerComposeConfigConstructor
  }

  exec(options: ExecOptions, service: string, cmd: string): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.exec(
      options, service, cmd
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  log(options: LogOptions, services: string[]): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.log(
      options, services
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  run(options: RunOptions, service: string, cmd: string): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.run(
      options, service, cmd
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  start(options: StartOptions, services: string[]): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.start(
      options, services
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  stop(options: StopOptions, services: string[]): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.stop(
      options, services
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  status(options: StatusOptions, services: string[]): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.status(
      options, services
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  pull(options: PullOptions, services: string[]): void {
    const dockerComposeCmd = this.dockerComposeCmdConstructor.pull(
      options, services
    )

    return this.execDockerCompose(dockerComposeCmd)
  }

  private execDockerCompose(dockerComposeCmd: string): void {
    const dockerComposeConfig = this.dockerComposeConfigConstructor.constructDockerComposeConfig()
    this.writeDockerComposeConfig(dockerComposeConfig)

    return this.shellCallback(dockerComposeCmd)
  }

  private writeDockerComposeConfig(dockerComposeConfig: DockerComposeConfig): void {
    const dockerComposeConfigRepo = new DockerComposeConfigRepo(
      this.workDir, this.dockerComposeConfigName
    )

    return dockerComposeConfigRepo.write(dockerComposeConfig)
  }
}
