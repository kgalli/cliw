import {flags} from '@oclif/command'

import {defaultProject} from '../../config'

import ServiceRuntimeConfigRepo from './config/service-runtime-config-repo'

const runtimeConfig = defaultProject.configDir ?
  new ServiceRuntimeConfigRepo(defaultProject.configDir).load() :
  {environments: [], defaultEnvironment: 'development'}

function environments(): string[] {
  return runtimeConfig.environments
}

function defaultEnvironment(): string {
  return runtimeConfig.defaultEnvironment
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
  default: defaultEnvironment(),
})

export const dryRunFlag = flags.boolean({
  description: 'Print command(s) to STDOUT without actually executing.',
  default: false,
})
