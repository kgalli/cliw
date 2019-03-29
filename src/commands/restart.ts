import {flags} from '@oclif/command'

import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'

export default class ReStart extends DockerComposeCommand {
  static description = 'stop, (re)create and start services in daemon mode'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(ReStart)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dockerCompose(dryRun)
        .restart(services, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
