import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, serviceFlag} from '../flags'

export default class Run extends BaseCommand {
  static description = 'run a one-off command on a service'

  static flags = {
    service: serviceFlag,
    environment: environmentFlag,
    help: flags.help({char: 'h'})
  }

  static args = [
    {
      name: 'command',
      description: 'specify command to execute',
      required: true,
    }
  ]

  static strict = false

  async run() {
    const {flags} = this.parse(Run)
    const service = flags.service
    const environment = flags.environment

    const {args} = this.parse(Run)
    const cmd = args.command

    try {
      this
        .dockerCompose()
        .run({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
