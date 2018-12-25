import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Run extends BaseCommand {
  static description = 'run a one-off command on a service'

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
    const {flags} = this.parse(Run)
    const service = flags.service
    const environment = flags.environment

    const {args} = this.parse(Run)
    const cmd = args.command

    this
      .dockerCompose()
      .run({}, service, environment, cmd)
  }
}
