import {flags as flagsHelper} from '@oclif/command'

import {StatusOptions} from '../../types'
import BaseCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag, servicesFlag} from '../../wrapper/service/flags'

export default class Status extends BaseCommand {
  static description = 'Show service(s) run status.'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flagsHelper.help({char: 'h'}),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run(): Promise<void> {
    const {argv, flags} = this.parse(Status)
    const services = argv
    const {environment} = flags
    const dryRun = flags['dry-run']
    const statusOptions: StatusOptions = {showAll: true}

    try {
      this
      .service(dryRun, environment)
      .status(statusOptions, services)
    } catch (error) {
      this.error(`${error.message}\nSee more help with --help`, error)
    }
  }
}
