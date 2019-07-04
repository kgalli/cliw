import {flags} from '@oclif/command'

import {dryRunFlag} from '../flags'
import DockerComposeCommand from '../wrapper/docker-compose'
import {environmentFlag, servicesFlag} from '../wrapper/docker-compose/flags'

export default class Logs extends DockerComposeCommand {
  static description = 'show service logs'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    dryRun: dryRunFlag,
    help: flags.help({char: 'h'}),
    follow: flags.boolean({
      char: 'f',
      description: 'follow log output',
      default: false
    }),
    timestamps: flags.boolean({
      char: 't',
      description: 'show timestamps',
      default: false
    }),
  }

  async run() {
    const {flags} = this.parse(Logs)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags.dryRun
    const options = {
      follow: flags.follow,
      timestamps: flags.timestamps
    }

    try {
      this
        .dockerCompose(dryRun)
        .logs(options, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
