import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {dataSourceNameArg} from '../../wrapper/db-tools/args'
import {environmentFlag} from '../../wrapper/db-tools/flags'
import PgrestoreOptions from '../../wrapper/db-tools/pgrestore-options'

export default class Restore extends DbToolsWrapper {
  static description = 'restore database'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    'restore-file': flags.string({
      char: 'r',
      description: 'restore file location (relative to current directory)',
      multiple: false,
      required: true
    }),
    help: flags.help({char: 'h'})
  }

  static args = [
    dataSourceNameArg
  ]

  async run() {
    const {args, flags} = this.parse(Restore)
    const service = args.datasource
    const environment = flags.environment
    const restoreFileLocation = flags['restore-file']
    const dryRun = flags['dry-run']
    const options: PgrestoreOptions = {
      restoreFileLocation
    }

    try {
      await this
        .dbTools(dryRun)
        .restore(options, service, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
