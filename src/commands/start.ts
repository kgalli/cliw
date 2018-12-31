import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'

export default class Start extends BaseCommand {
  static description = '(re)creates and starts services in daemon mode'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Start)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dockerCompose(dryRun)
        .start({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
