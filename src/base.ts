import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {homedir} from 'os'

import InitConfigRepo from './init-config-repo'
import {MainConfig, MainConfigRepo} from './main-config-repo'
import BashShell from './wrapper/bash'
import DockerComposeWrapper from './wrapper/docker-compose'

const INIT_CONFIG_FILENAME = '.orchestrator-init-config.json'
const INIT_CONFIG_LOCATION = `${homedir()}/${INIT_CONFIG_FILENAME}`
const CLI_NAME = 'orchestrator'
const MAIN_CONFIG_TEMPLATE_LOCATION = `${__dirname}/main-config-template.json`

function mainConfig(): MainConfig {
  try {
    const initConfigRepo = new InitConfigRepo(CLI_NAME, INIT_CONFIG_FILENAME, INIT_CONFIG_LOCATION)
    const initConfig = initConfigRepo.exists() ? initConfigRepo.load() : {mainConfigLocation: MAIN_CONFIG_TEMPLATE_LOCATION}
    const mainConfigRepo = new MainConfigRepo(initConfig.mainConfigLocation)
    const mainConfig = mainConfigRepo.load()

    return mainConfig
  } catch (e) {
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
      options: mainConfig().services,
      //default: mainConfig.internalServices
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
      options: mainConfig().services
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
    const initConfigRepo = new InitConfigRepo(CLI_NAME, INIT_CONFIG_FILENAME, INIT_CONFIG_LOCATION)

    try {
      if (initConfigRepo.exists() === false) {
        const mainConfigLocation = await cli.prompt('Please enter the location of you <main-config>.json file')
        const initConfig = {mainConfigLocation}

        initConfigRepo.save(initConfig)
        process.exit(0)
      }
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
