import {flags} from '@oclif/command'

import {MainConfig} from './config/main-config'
import MainConfigService from './config/main-config-service'

function mainConfig(): MainConfig {
  const mainConfigService = new MainConfigService()
  const mainConfig = mainConfigService.mainConfig()

  return mainConfig
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
