import {flags} from '@oclif/command'

import ConfigUtils from '../../config/config-utils'

function environments(): string[] {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.mainConfigLoadDefault().dbTools.environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.mainConfigLoadDefault().dbTools.defaultEnvironment
  }

  return
}

export const connectionFlag = flags.string({
  char: 's',
  multiple: false,
  required: true
})

export const environmentFlag = flags.string({
  char: 'e',
  required: true,
  options: environments(),
  default: defaultEnvironment()
})
