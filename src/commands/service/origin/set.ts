import {flags} from '@oclif/command'

import BaseCommand from '../../../base-command'
import {projectsBuildOriginConfigUpdateServiceBuildOrigin} from '../../../config'
import {BuildOrigin} from '../../../config/build-origins-config'
import {environmentFlag} from '../../../wrapper/docker-compose/flags'

export default class BuildOriginSet extends BaseCommand {
  static description = 'set service build origin SOURCE|REGISTRY'

  static flags = {
    help: flags.help({char: 'h'}),
    environment: environmentFlag,
  }

  static args = [
    {
      name: 'service',
      required: true,
      description: 'service name'
    },
    {
      name: 'value',
      required: true,
      description: 'build origin',
      options: [BuildOrigin.REGISTRY, BuildOrigin.SOURCE]
    },
  ]

  static examples = [
    '$ cliw service:origin:set api source'
  ]

  async run() {
    const {args, flags} = this.parse(BuildOriginSet)
    const service = args.service
    const environment = flags.environment
    const buildOrigin = args.value === BuildOrigin.REGISTRY.toString()
      ? BuildOrigin.REGISTRY
      : BuildOrigin.SOURCE

    projectsBuildOriginConfigUpdateServiceBuildOrigin(service, environment, buildOrigin)
  }
}
