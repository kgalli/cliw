import {flags} from '@oclif/command'

import {defaultProject} from '../../config'

import ServiceMetadataRepo from './config/service-meta-config-repo'

const serviceMetadataConfig = defaultProject.configDir ?
  new ServiceMetadataRepo(defaultProject.configDir).load() :
  {environments: [], defaultEnvironment: 'development'}

function environments(): string[] {
  return serviceMetadataConfig.environments
}

function defaultEnvironment(): string {
  return serviceMetadataConfig.defaultEnvironment
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
