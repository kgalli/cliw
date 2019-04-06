import {flags} from '@oclif/command'

import ConfigUtils from './config/config-utils'
import {MainConfig} from './config/main-config'

function mainConfig(): MainConfig {
  try {
    return ConfigUtils.mainConfigLoadDefault()
    // tslint:disable-next-line no-unused
  } catch (e) {
    // TODO investigate and find better solution than swallowing the error
    // Error is swallowed because if we run init command
    // while the projectsConfig does not exist we have an issue
    // because flags get loaded anyway and then it fails with nasty error
    return {} as MainConfig
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
