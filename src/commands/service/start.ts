import {flags as flagsHelper} from '@oclif/command'

import BaseCommand from '../../wrapper/service'
import {servicesArg} from '../../wrapper/service/args'
import {dryRunFlag, environmentFlag} from '../../wrapper/service/flags'

export default class Start extends BaseCommand {
  static description = 'Start service(s) in daemon mode.'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flagsHelper.help({char: 'h'}),
    build: flagsHelper.boolean({default: true, allowNo: true, description: 'Build images before starting containers.'}),
  }

  static strict = false

  static args = [
    servicesArg,
  ]

  async run(): Promise<void> {
    const {argv, flags} = this.parse(Start)
    const services = argv
    const {environment} = flags
    const dryRun = flags['dry-run']
    const startOptions = {
      build: flags.build,
    }

    try {
      this
        .service(dryRun, environment)
        .start(startOptions, services)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
