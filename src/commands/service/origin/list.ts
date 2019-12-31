import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

import {dryRunFlag} from '../../../flags'
import DockerComposeCommand from '../../../wrapper/service'
import {environmentFlag, servicesFlag} from '../../../wrapper/service/flags'

export default class BuildOriginList extends DockerComposeCommand {
  static description = 'list service(s) origin SOURCE|REGISTRY'

  static flags = {
    help: flags.help({char: 'h'}),
    services: {...servicesFlag, required: false},
    'dry-run': dryRunFlag,
    environment: environmentFlag,
  }

  async run() {
    const {flags} = this.parse(BuildOriginList)
    const environment = flags.environment
    const dryRun = flags['dry-run']
    const serviceNames = this
      .service(dryRun)
      .serviceNames()

    const data = [] as any
    serviceNames.forEach(serviceName => {
      const buildOrigin = this.service().buildOrigin(serviceName, environment)

      if (!flags.services || flags.services.includes(serviceName)) {
        data.push({name: serviceName, buildOrigin: (buildOrigin).toUpperCase()})
      }
    })

    cli.table(data, {name: {header: 'ServiceName', minWidth: 7}, buildOrigin: {header: 'BuildOrigin'}}, {
      printLine: this.log
    })
  }
}
