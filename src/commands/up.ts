import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Up extends BaseCommand {
  static description = 'Builds, (re)creates, starts, and attaches to containers for a service'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Up)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .up({}, services, environment)
  }
}
