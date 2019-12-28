import {flags} from '@oclif/command'

import {mainConfigLoadDefault, projectsConfigExists} from '../../config'

function environments(): string[] {
  if (projectsConfigExists()) {
    return mainConfigLoadDefault().dbTools.environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (projectsConfigExists()) {
    return mainConfigLoadDefault().dbTools.defaultEnvironment
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
