import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Status extends BaseCommand {
  static description = 'show service run status'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Status)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .status({}, services, environment)
  }
}
