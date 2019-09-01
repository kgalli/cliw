import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {dataSourceNameArg} from '../../wrapper/db-tools/args'
import {environmentFlag} from '../../wrapper/db-tools/flags'

export default class Console extends DbToolsWrapper {
  static description = 'run database console'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'})
  }

  static args = [
    dataSourceNameArg
  ]

  async run() {
    const {args, flags} = this.parse(Console)
    const dataSource = args.datasource
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      await this
        .dbTools(dryRun)
        .console({}, dataSource, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
