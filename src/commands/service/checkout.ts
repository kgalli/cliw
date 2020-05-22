import {flags as flagsHelper} from '@oclif/command'

import BaseCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag, servicesFlag} from '../../wrapper/service/flags'

export default class Checkout extends BaseCommand {
  static description = 'Checkout service(s) from version control.'

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

  async run() {
    const {argv, flags} = this.parse(Checkout)
    const services = argv
    const {environment} = flags
    const dryRun = flags['dry-run']

    throw new Error('Not implemented exception!')
  }
}
