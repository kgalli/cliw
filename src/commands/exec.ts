import {flags} from '@oclif/command'

import {dryRunFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'
import {environmentFlag, serviceFlag} from '../wrapper/docker-compose/flags'

export default class Exec extends DockerComposeCommand {
  static description = 'execute a command in a running container'

  static flags = {
    service: serviceFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
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
    const {flags, args} = this.parse(Exec)
    const service = flags.service
    const environment = flags.environment
    const dryRun = flags.dryRun

    const cmd = args.command

    try {
      this
        .dockerCompose(dryRun)
        .exec({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
