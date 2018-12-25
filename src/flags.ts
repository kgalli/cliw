import {flags} from '@oclif/command'

function getTeam() {
  // imagine this reads a configuration file or something to find the team
  return 'defaultTeam'
}

export const team = flags.build({
  char: 't',
  description: 'team to use',
  default: () => getTeam(),
})

export const dryRun = flags.boolean({
  char: 'd',
  description: 'Wrapped commands will be printed WITHOUT actually being executed',
  default: false
})

export const dockerComposeFlags = {
  service: flags.string({
    char: 's',
    description: 'Specify the service',
    multiple: true,
    required: true,
    options: ['web', 'api']
  }),
  environment: flags.string({
    char: 'e',
    required: true,
    options: ['development', 'staging', 'production'],
    default: 'development'
  })
}
