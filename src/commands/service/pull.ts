import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import ServiceCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {environmentFlag} from '../../wrapper/service/flags'

export default class Pull extends ServiceCommand {
  static description = 'pull docker image(s) from registry'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Pull)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .service(dryRun)
        .pull({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
