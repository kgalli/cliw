import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Start extends BaseCommand {
  static description = '(re)creates and starts services in daemon mode'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Start)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .start({}, services, environment)
  }
}
