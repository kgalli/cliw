import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DbToolsWrapper from '../../wrapper/db-tools'
import {dataSourceNameArg} from '../../wrapper/db-tools/args'
import DbConsoleOptions from '../../wrapper/db-tools/db-console-options'
import {environmentFlag} from '../../wrapper/db-tools/flags'

export default class Console extends DbToolsWrapper {
  static description = 'run database console'

  static flags = {
    environment: environmentFlag,
    command: flags.string({
      char: 'c',
      description: 'run only single command (SQL or internal) and exit',
      multiple: false,
      required: false,
      exclusive: ['file']
    }),
    file: flags.string({
      char: 'f',
      description: 'execute commands from file, then exit',
      multiple: false,
      required: false,
      exclusive: ['command']
    }),
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
    const command = flags.command
    const file = flags.file
    const options: DbConsoleOptions = {
      command,
      file
    }

    try {
      await this
        .dbTools(dryRun, environment)
        .console(options, dataSource)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
