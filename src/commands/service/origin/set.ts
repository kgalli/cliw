import {flags} from '@oclif/command'

import ServiceCommand from '../../../wrapper/service'
import {BuildOrigin} from '../../../wrapper/service/config/build-origins-config'
import {environmentFlag} from '../../../wrapper/service/flags'

export default class BuildOriginSet extends ServiceCommand {
  static description = 'set service build origin SOURCE|REGISTRY'

  static flags = {
    environment: environmentFlag,
    help: flags.help({char: 'h'})
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

    try {
      this
        .service()
        .buildOriginSet(service, environment, buildOrigin)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
