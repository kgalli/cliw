import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import ServiceCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {environmentFlag, servicesFlag} from '../../wrapper/service/flags'

export default class Status extends ServiceCommand {
  static description = 'show services run status'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Status)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .service(dryRun)
        .status({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
