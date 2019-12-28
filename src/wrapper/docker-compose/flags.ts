import {flags} from '@oclif/command'

import {mainConfigLoadDefault, projectsConfigExists} from '../../config'

function environments(): string[] {
  if (projectsConfigExists()) {
    return mainConfigLoadDefault().compose.environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (projectsConfigExists()) {
    return mainConfigLoadDefault().compose.defaultEnvironment
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
