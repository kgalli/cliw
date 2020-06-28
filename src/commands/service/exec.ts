import {flags as flagsHelper} from '@oclif/command'

import {ExecOptions} from '../../types'
import BaseCommand from '../../wrapper/service'
import {serviceArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag} from '../../wrapper/service/flags'

export default class Exec extends BaseCommand {
  static description = 'Execute a command in a running service container.'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flagsHelper.help({char: 'h'}),
    'no-tty': flagsHelper.boolean({default: false, description: 'Disable pseudo-tty allocation.'}),
  }

  static args = [
    serviceArg,
    {
      name: 'command',
      description: 'specify command to execute',
      required: true,
    },
  ]

  static strict = false

  async run(): Promise<void> {
    const {flags, args, argv} = this.parse(Exec)
    const {service} = args
    const {environment} = flags
    const dryRun = flags['dry-run']
    const options: ExecOptions = {noTty: flags['no-tty']}
    const cmd = argv.slice(1).join(' ')

    try {
      this
        .service(dryRun, environment)
        .exec(options, service, cmd)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
