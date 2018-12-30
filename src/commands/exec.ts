import {flags} from '@oclif/command'

import BaseCommand from '../base'
import {environmentFlag, serviceFlag} from '../flags'

export default class Exec extends BaseCommand {
  static description = 'execute a command in a running container'

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
    const {flags} = this.parse(Exec)
    const service = flags.service
    const environment = flags.environment

    const {args} = this.parse(Exec)
    const cmd = args.command

    try {
      this
        .dockerCompose()
        .exec({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
