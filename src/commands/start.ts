import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, servicesFlag} from '../flags'

export default class Start extends BaseCommand {
  static description = '(re)creates and starts services in daemon mode'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Start)
    const services = flags.services
    const environment = flags.environment

    try {
      this
        .dockerCompose()
        .start({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
