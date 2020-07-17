import {flags as flagsHelper} from '@oclif/command'

import {StopOptions} from '../../types'
import BaseCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag} from '../../wrapper/service/flags'

export default class Stop extends BaseCommand {
  static description = 'Stop running service(s).'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flagsHelper.help({char: 'h'}),
    timeout: flagsHelper.integer({
      char: 't',
      description: 'Specify a shutdown timeout in seconds.',
      default: 10,
    }),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run(): Promise<void> {
    const {argv, flags} = this.parse(Stop)
    const services = argv
    const {environment} = flags
    const dryRun = flags['dry-run']
    const stopOptions: StopOptions = {timeout: flags.timeout}

    try {
      this
      .service(dryRun, environment)
      .stop(stopOptions, services)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
