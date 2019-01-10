import {flags} from '@oclif/command'

import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'

export default class Up extends DockerComposeCommand {
  static description = 'builds, (re)creates, starts, and attaches to containers for a service'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Up)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dockerCompose(dryRun)
        .up({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
