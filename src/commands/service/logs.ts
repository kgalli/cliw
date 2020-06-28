import {flags as flagsHelper} from '@oclif/command'

import BaseCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag} from '../../wrapper/service/flags'

export default class Logs extends BaseCommand {
  static description = 'Show service(s) logs.'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flagsHelper.help({char: 'h'}),
    follow: flagsHelper.boolean({
      char: 'f',
      description: 'follow log output',
      default: false,
    }),
    timestamps: flagsHelper.boolean({
      char: 't',
      description: 'show timestamps',
      default: false,
    }),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run(): Promise<void> {
    const {argv, flags} = this.parse(Logs)
    const services = argv
    const {environment} = flags
    const dryRun = flags['dry-run']
    const options = {
      follow: flags.follow,
      timestamps: flags.timestamps,
    }

    try {
      this
      .service(dryRun, environment)
      .log(options, services)
    } catch (error) {
      this.error(`${error.message}\nSee more help with --help`, error)
    }
  }
}
