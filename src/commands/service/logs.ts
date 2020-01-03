import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import ServiceCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {environmentFlag} from '../../wrapper/service/flags'

export default class Logs extends ServiceCommand {
  static description = 'show service logs'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
    follow: flags.boolean({
      char: 'f',
      description: 'follow log output',
      default: false
    }),
    timestamps: flags.boolean({
      char: 't',
      description: 'show timestamps',
      default: false
    }),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run() {
    const {argv, flags} = this.parse(Logs)
    const services = argv
    const environment = flags.environment
    const dryRun = flags['dry-run']
    const options = {
      follow: flags.follow,
      timestamps: flags.timestamps
    }

    try {
      this
        .service(dryRun)
        .logs(options, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
