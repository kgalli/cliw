import {flags} from '@oclif/command'

import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'

export default class Start extends DockerComposeCommand {
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
      this.error(e.message, e)
    }
  }
}
