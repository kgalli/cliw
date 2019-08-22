import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DockerComposeCommand from '../../wrapper/docker-compose'
import {serviceArg} from '../../wrapper/docker-compose/args'
import {environmentFlag} from '../../wrapper/docker-compose/flags'

export default class Run extends DockerComposeCommand {
  static description = 'run a one-off command on a service'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'})
  }

  static args = [
    serviceArg,
    {
      name: 'command',
      description: 'specify command to execute',
      required: true,
    }
  ]

  static strict = false

  async run() {
    const {flags, args, argv} = this.parse(Run)
    const service = args.service
    const environment = flags.environment
    const dryRun = flags['dry-run']
    const cmd = argv.slice(1).join(' ')

    try {
      this
        .dockerCompose(dryRun)
        .run({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
