import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, servicesFlag} from '../flags'

export default class Pull extends BaseCommand {
  static description = 'pull docker image(s) from registry'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Pull)
    const services = flags.services
    const environment = flags.environment

    try {
      this
        .dockerCompose()
        .pull({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
