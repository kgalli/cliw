import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import ServiceCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {environmentFlag} from '../../wrapper/service/flags'

export default class Stop extends ServiceCommand {
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
        .service(dryRun)
        .stop({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
