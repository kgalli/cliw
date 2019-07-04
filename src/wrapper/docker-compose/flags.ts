import {flags} from '@oclif/command'

import ConfigUtils from '../../config/config-utils'

function environments(): string[] {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.mainConfigLoadDefault().compose.environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.mainConfigLoadDefault().compose.defaultEnvironment
  }

  return
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
  options: environments(),
  default: defaultEnvironment()
})
