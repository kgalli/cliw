import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {connectionFlag, environmentFlag} from '../../wrapper/db-tools/flags'

export default class Create extends DbToolsWrapper {
  static description = 'create database'

  static flags = {
    service: connectionFlag,
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Create)
    const service = flags.service
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      await this
        .dbTools(dryRun)
        .create(service, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
