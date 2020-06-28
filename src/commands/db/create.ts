import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {dataSourceNameArg} from '../../wrapper/db-tools/args'
import {environmentFlag} from '../../wrapper/db-tools/flags'

export default class Create extends DbToolsWrapper {
  static description = 'create database'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  static args = [
    dataSourceNameArg,
  ]

  async run() {
    const {args, flags} = this.parse(Create)
    const datasource = args.datasource
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      await this
      .dbTools(dryRun, environment)
      .create(datasource)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
