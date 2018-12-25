import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Exec extends BaseCommand {
  static description = 'execute a command in a running container'

  static flags = {
    ...BaseCommand.serviceEnvironmentsFlags,
    help: flags.help({char: 'h'}
    )
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

    this
      .dockerCompose()
      .exec({}, service, environment, cmd)
  }
}
