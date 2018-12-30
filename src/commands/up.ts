import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, servicesFlag} from '../flags'

export default class Up extends BaseCommand {
  static description = 'builds, (re)creates, starts, and attaches to containers for a service'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Up)
    const services = flags.services
    const environment = flags.environment

    try {
      this
        .dockerCompose()
        .up({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
