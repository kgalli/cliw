import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Build extends BaseCommand {
  static description = 'Build or rebuild services'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Build)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .build({}, services, environment)
  }
}
