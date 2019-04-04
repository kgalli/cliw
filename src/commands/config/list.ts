import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import {projectFlag} from '../../flags'

export default class List extends BaseCommand {
  static description = 'list config options'

  static flags = {
    help: flags.help({char: 'h'}),
    project: projectFlag,
  }

  async run() {
    const {flags} = this.parse(List)

    this.log(`${JSON.stringify(flags)}`)
  }
}
