import {flags} from '@oclif/command'

import {defaultProject, projectsConfigExists} from '../../config'

import {loadDbToolsConfig} from './config'

function environments(): string[] {
  if (projectsConfigExists()) {
    return loadDbToolsConfig(defaultProject.mainConfigLocation).environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (projectsConfigExists()) {
    return loadDbToolsConfig(defaultProject.mainConfigLocation).defaultEnvironment
  }

  return
}

export const environmentFlag = flags.string({
  char: 'e',
  required: true,
  options: environments(),
  default: defaultEnvironment()
})
