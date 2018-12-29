import {Command, flags} from '@oclif/command'
import chalk from 'chalk'

import InitConfigRepo from './init-config-repo'
import {MainConfig, MainConfigRepo} from './main-config-repo'
import BashShell from './wrapper/bash'
import DockerComposeWrapper from './wrapper/docker-compose'

const MAIN_CONFIG_TEMPLATE_LOCATION = `${__dirname}/main-config-template.json`

function mainConfig(): MainConfig {
  try {
    const initConfigRepo = new InitConfigRepo()
    const initConfig = initConfigRepo.exists() ? initConfigRepo.load() : {mainConfigLocation: MAIN_CONFIG_TEMPLATE_LOCATION}
    const mainConfigRepo = new MainConfigRepo(initConfig.mainConfigLocation)
    const mainConfig = mainConfigRepo.load()

    return mainConfig
  } catch (e) {
    // tslint:disable-next-line no-console
    console.error(e.message)
    return process.exit(1)
  }
}

export default abstract class extends Command {
  static servicesEnvironmentsFlags = {
    service: flags.string({
      char: 's',
      description: 'specify the service',
      multiple: true,
      required: true,
      options: mainConfig().services.map(s => s.name),
      //default: mainConfig().services.map(s => s.name)
    }),
    environment: flags.string({
      char: 'e',
      required: true,
      options: mainConfig().environments,
      default: mainConfig().defaultEnvironment
    })
  }

  static serviceEnvironmentsFlags = {
    service: flags.string({
      char: 's',
      description: 'specify the service',
      multiple: false,
      required: true,
      options: mainConfig().services.map(s => s.name)
    }),
    environment: flags.string({
      char: 'e',
      required: true,
      options: mainConfig().environments,
      default: mainConfig().defaultEnvironment
    })
  }

  dockerCompose() {
    return new DockerComposeWrapper(mainConfig(), this.shell())
  }

  shell() {
    return new BashShell()
  }

  async init() {
    const initConfigRepo = new InitConfigRepo()

    try {
      if (initConfigRepo.exists() === false && this.id !== 'init') {
        this.error(`Location of <main-config>.json not found. Please see '${chalk.yellow(this.config.name + ' init --help')}' for help.`)

        process.exit(0)
      }
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
