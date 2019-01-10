import {flags} from '@oclif/command'

import {dryRunFlag, environmentFlag, serviceFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'

export default class Run extends DockerComposeCommand {
  static description = 'run a one-off command on a service'

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
    const {flags, args} = this.parse(Run)
    const service = flags.service
    const environment = flags.environment
    const dryRun = flags.dryRun
    const cmd = args.command

    try {
      this
        .dockerCompose(dryRun)
        .run({}, service, environment, cmd)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
