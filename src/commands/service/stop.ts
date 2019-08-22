import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DockerComposeCommand from '../../wrapper/docker-compose'
import {servicesArg} from '../../wrapper/docker-compose/args'
import {environmentFlag} from '../../wrapper/docker-compose/flags'

export default class Stop extends DockerComposeCommand {
  static description = 'stop services running in daemon mode'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
    timeout: flags.integer({
      char: 't',
      description: 'specify a shutdown timeout in seconds',
      default: 10
    })
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Stop)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .dockerCompose(dryRun)
        .stop({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
