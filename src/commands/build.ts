import {flags} from '@oclif/command'

import {dryRunFlag, environmentFlag, servicesFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'

export default class Build extends DockerComposeCommand {
  static description = 'build or rebuild services'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Build)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dockerCompose(dryRun)
        .build({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
