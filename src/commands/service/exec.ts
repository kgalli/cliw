import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DockerComposeCommand from '../../wrapper/docker-compose'
import {serviceArg} from '../../wrapper/docker-compose/args'
import {environmentFlag} from '../../wrapper/docker-compose/flags'

export default class Exec extends DockerComposeCommand {
  static description = 'execute a command in a running container'

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

  async run() {
    const {flags, args, argv} = this.parse(Exec)
    const service = args.service
    const environment = flags.environment
    const dryRun = flags['dry-run']

    const cmd = argv.slice(1).join(' ')

    try {
      this
        .dockerCompose(dryRun)
        .exec({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
