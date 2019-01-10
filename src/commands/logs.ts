import {flags} from '@oclif/command'

import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'

export default class Logs extends DockerComposeCommand {
  static description = 'show service logs'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Logs)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dockerCompose(dryRun)
        .logs({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
