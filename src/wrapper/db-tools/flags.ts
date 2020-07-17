import {flags} from '@oclif/command'

import {projectsConfigExists} from '../../config'

import {loadDbToolsConfig} from './config'

function environments(): string[] {
  if (projectsConfigExists()) {
    return loadDbToolsConfig().environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (projectsConfigExists()) {
    return loadDbToolsConfig().defaultEnvironment
  }
}

export const environmentFlag = flags.string({
  char: 'e',
  required: true,
  options: environments(),
  default: defaultEnvironment(),
})
