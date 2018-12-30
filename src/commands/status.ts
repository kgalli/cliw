import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, servicesFlag} from '../flags'

export default class Status extends BaseCommand {
  static description = 'show service run status'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Status)
    const services = flags.services
    const environment = flags.environment

    try {
      this
        .dockerCompose()
        .status({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
