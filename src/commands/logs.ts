import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, servicesFlag} from '../flags'

export default class Logs extends BaseCommand {
  static description = 'show service logs'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Logs)
    const services = flags.services
    const environment = flags.environment

    try {
      this
        .dockerCompose()
        .logs({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
