import {flags} from '@oclif/command'

import InitConfigRepo from './config/init-config-repo'
import {MainConfig, MainConfigRepo} from './config/main-config-repo'

const MAIN_CONFIG_TEMPLATE_LOCATION = `${__dirname}/config/main-config-template.json`

let mainConfigMemory: MainConfig

function mainConfig(): MainConfig {
  if (mainConfigMemory) {
    return mainConfigMemory
  }

  try {
    const mainConfigLocationEnvVar = process.env.ORCHESTRATOR_MAIN_CONFIG_LOCATION
    let mainConfigLocation = MAIN_CONFIG_TEMPLATE_LOCATION

    if (mainConfigLocationEnvVar) {
      mainConfigLocation = mainConfigLocationEnvVar
    } else {
      const initConfigRepo = new InitConfigRepo()

      if (initConfigRepo.exists()) {
        mainConfigLocation = initConfigRepo.load().mainConfigLocation
      }
    }

    const mainConfigRepo = new MainConfigRepo(mainConfigLocation)
    const mainConfig = mainConfigRepo.load()

    mainConfigMemory = mainConfig

    return mainConfig
  } catch (e) {
    // tslint:disable-next-line no-console
    console.error(e.message)
    return process.exit(1)
  }
}

export const servicesFlag = flags.string({
  char: 's',
  multiple: true,
})

export const serviceFlag = flags.string({
  char: 's',
  multiple: false,
  required: true,
})

export const environmentFlag = flags.string({
  char: 'e',
  required: true,
  options: mainConfig().environments,
  default: mainConfig().defaultEnvironment
})

export const dryRunFlag = flags.boolean({
  description: 'print shell commands without executing',
  default: false
})
