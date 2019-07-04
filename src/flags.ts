import {flags} from '@oclif/command'

import ConfigUtils from './config/config-utils'

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
