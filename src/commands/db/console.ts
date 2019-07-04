import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {connectionFlag, environmentFlag} from '../../wrapper/db-tools/flags'

export default class Console extends DbToolsWrapper {
  static description = 'run database console'

  static flags = {
    service: connectionFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Console)
    const service = flags.service
    const environment = flags.environment
    const dryRun = flags.dryRun

    try {
      this
        .dbTools(dryRun)
        .console({}, service, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
