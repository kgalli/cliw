import {flags} from '@oclif/command'

import {defaultProject, projectsConfigExists} from '../../config'

import {loadDbToolsConfig} from './config'

function environments(): string[] {
  if (projectsConfigExists()) {
    return loadDbToolsConfig(defaultProject.mainConfigPath).environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (projectsConfigExists()) {
    return loadDbToolsConfig(defaultProject.mainConfigPath).defaultEnvironment
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
