import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DockerComposeCommand from '../../wrapper/docker-compose'
import {servicesArg} from '../../wrapper/docker-compose/args'
import {environmentFlag, servicesFlag} from '../../wrapper/docker-compose/flags'

export default class Status extends DockerComposeCommand {
  static description = 'show services run status'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Status)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .dockerCompose(dryRun)
        .status({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
