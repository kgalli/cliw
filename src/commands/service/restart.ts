import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import ServiceCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {environmentFlag} from '../../wrapper/service/flags'

export default class ReStart extends ServiceCommand {
  static description = 'stop, (re)create and start services in daemon mode'

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
    const {argv, flags} = this.parse(ReStart)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .service(dryRun)
        .restart(services, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
