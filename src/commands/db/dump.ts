import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {dataSourceNameArg} from '../../wrapper/db-tools/args'
import {environmentFlag} from '../../wrapper/db-tools/flags'
import PgdumpOptions from '../../wrapper/db-tools/pgdump-options'

export default class Dump extends DbToolsWrapper {
  static description = 'create database'

  static flags = {
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    'schema-only': flags.boolean({
      char: 'o',
      description: 'dump schema without data',
      default: false
    }),
    target: flags.string({
      char: 't',
      description: 'dump file location (relative to current directory)',
      multiple: false,
      required: true
    }),
    help: flags.help({char: 'h'})
  }

  static args = [
    dataSourceNameArg
  ]

  async run() {
    const {args, flags} = this.parse(Dump)
    const service = args.datasource
    const environment = flags.environment
    const dryRun = flags['dry-run']
    const options: PgdumpOptions = {
      target: flags.target,
      schemaOnly: flags['schema-only']
    }

    try {
      await this
        .dbTools(dryRun)
        .dump(options, service, environment)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
