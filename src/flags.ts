import {flags} from '@oclif/command'

import {projectsConfigExists, projectsConfigLoad} from './config'

function projects() {
  if (projectsConfigExists()) {
    return projectsConfigLoad().projects.map(p => p.name)
  }
}

function defaultProject(): string | undefined {
  if (projectsConfigExists()) {
    return projectsConfigLoad().default
  }
}

export const dryRunFlag = flags.boolean({
  description: 'print shell commands without executing',
  default: false,
})

export const projectFlag = flags.string({
  char: 'p',
  required: true,
  options: projects(),
  default: defaultProject(),
})
