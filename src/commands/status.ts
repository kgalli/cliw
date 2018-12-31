import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'

export default class Status extends BaseCommand {
  static description = 'show service run status'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Status)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dockerCompose(dryRun)
        .status({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
