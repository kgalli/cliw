import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import ServiceCommand from '../../wrapper/service'
import {serviceArg} from '../../wrapper/service/args'
import {environmentFlag} from '../../wrapper/service/flags'

export default class Exec extends ServiceCommand {
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
        .service(dryRun)
        .exec({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
