import {flags as flagsHelper} from '@oclif/command'
import {cli} from 'cli-ux'

import BaseCommand from '../../wrapper/service'

export default class List extends BaseCommand {
  static description = 'List service(s) metadata.'

  static flags = {
    help: flagsHelper.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run(): Promise<void> {
    const {flags} = this.parse(List)
    const servicesMetadata = this.servicesMetadata()

    cli.table(servicesMetadata, {
      name: {
        minWidth: 7,
      },
      description: {
        get: row => row.description || '',
      },
      directory: {
        get: row => row.directory || '',
        extended: true,
      },
      repositoryUrl: {
        get: row => row.repositoryUrl || '',
        extended: true,
      },
      source: {
      },
    }, {
      printLine: this.log,
      ...flags,
    })
  }
}
