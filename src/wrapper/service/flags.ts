import {flags} from '@oclif/command'

function environments(): string[] {
  return ['development']
}

function defaultEnvironment(): string {
  return 'development'
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
