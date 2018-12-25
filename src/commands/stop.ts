import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Stop extends BaseCommand {
  static description = 'Stop services running in daemon mode'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'}),
    timeout: flags.integer({
      char: 't',
      description: 'specify a shutdown timeout in seconds',
      default: 10
    })
  }

  async run() {
    const {flags} = this.parse(Stop)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .stop({}, services, environment)
  }
}
