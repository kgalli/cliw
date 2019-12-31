import {flags} from '@oclif/command'

import {DEFAULT_CONFIG_PATH, defaultProject, projectsConfigExists} from '../../config'

import ServiceConfigHelper from './config'

const projectConfig = defaultProject
const serviceConfigHelper = new ServiceConfigHelper(
  DEFAULT_CONFIG_PATH,
  projectConfig.mainConfigLocation
)

function environments(): string[] {
  if (projectsConfigExists()) {
    return serviceConfigHelper.loadServiceConfig().environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (projectsConfigExists()) {
    return serviceConfigHelper.loadServiceConfig().defaultEnvironment
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
