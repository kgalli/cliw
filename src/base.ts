import {Command, flags} from '@oclif/command'

import BashShell from './wrapper/bash'
import DockerComposeWrapper from './wrapper/docker-compose'

const mainConfig = {
  workDir: '~/dev',
  mainConfig: '~/config/orchestrator',
  projectName: 'orchestrator',
  networkName: 'orchestrator',
  environments: ['development', 'staging', 'production'],
  defaultEnvironment: 'development',
  internalServices: ['web', 'api'],
  externalServices: ['db'],
  services: ['web', 'api', 'db']
}

export default abstract class extends Command {
  static servicesEnvironmentsFlags = {
    service: flags.string({
      char: 's',
      description: 'specify the service',
      multiple: true,
      required: true,
      options: mainConfig.services,
      //default: mainConfig.internalServices
    }),
    environment: flags.string({
      char: 'e',
      required: true,
      options: mainConfig.environments,
      default: mainConfig.defaultEnvironment
    })
  }

  static serviceEnvironmentsFlags = {
    service: flags.string({
      char: 's',
      description: 'specify the service',
      multiple: false,
      required: true,
      options: mainConfig.services
    }),
    environment: flags.string({
      char: 'e',
      required: true,
      options: mainConfig.environments,
      default: mainConfig.defaultEnvironment
    })
  }

  mainConfig() {
    return mainConfig
  }

  dockerCompose() {
    const mainConfig = this.mainConfig()
    const shellWrapper = new BashShell()

    return new DockerComposeWrapper(mainConfig, shellWrapper)
  }
}
