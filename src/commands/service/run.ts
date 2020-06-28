import {flags as flagsHelper} from '@oclif/command'

import {RunOptions} from '../../types'
import BaseCommand from '../../wrapper/service'
import {serviceArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag} from '../../wrapper/service/flags'

export default class Run extends BaseCommand {
  static description = 'Run a one-off command on a service.'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flagsHelper.help({char: 'h'}),
    'no--tty': flagsHelper.boolean({default: false, description: 'Disable pseudo-tty allocation.'}),
    entrypoint: flagsHelper.string({description: 'Override the entrypoint of the image.'}),
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
    const {flags, args, argv} = this.parse(Run)
    const {service} = args
    const {environment} = flags
    const dryRun = flags['dry-run']
    const options: RunOptions = {
      noTty: flags['no--tty'],
      entrypoint: flags.entrypoint,
    }
    const cmd = argv.slice(1).join(' ')

    try {
      this
      .service(dryRun, environment)
      .run(options, service, cmd)
    } catch (error) {
      this.error(`${error.message}\nSee more help with --help`, error)
    }
  }
}
