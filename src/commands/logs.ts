import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Logs extends BaseCommand {
  static description = 'show service logs'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Logs)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .logs({}, services, environment)
  }
}
