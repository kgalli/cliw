import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DockerComposeCommand from '../../wrapper/docker-compose'
import {servicesArg} from '../../wrapper/docker-compose/args'
import {environmentFlag} from '../../wrapper/docker-compose/flags'

export default class Start extends DockerComposeCommand {
  static description = '(re)create and start services in daemon mode'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'})
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Start)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .dockerCompose(dryRun)
        .start({}, services, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
