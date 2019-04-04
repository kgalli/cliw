import {flags} from '@oclif/command'

import ConfigUtils from './config/config-utils'

function environments(): string[] {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.mainConfigLoadDefault().environments
  }

  return []
}

function defaultEnvironment(): string | undefined {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.mainConfigLoadDefault().defaultEnvironment
  }

  return
}

function projects() {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.projectsConfigLoad().projects.map(p => p.name)
  }

  return
}


function defaultProject(): string | undefined {
  if (ConfigUtils.projectsConfigExists()) {
    return ConfigUtils.projectsConfigLoad().default
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

export const dryRunFlag = flags.boolean({
  description: 'print shell commands without executing',
  default: false
})

export const projectFlag = flags.string({
  char: 'p',
  required: true,
  options: projects(),
  default: defaultProject()
})
