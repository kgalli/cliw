import {flags} from '@oclif/command'

import BaseCommand from '../../../base-command'
import {BuildOrigin} from '../../../config/build-origins-config'
import ConfigUtils from '../../../config/config-utils'
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
    const serviceName = args.service
    const environment = flags.environment
    const buildOrigin = args.value === BuildOrigin.REGISTRY.toString() ? BuildOrigin.REGISTRY : BuildOrigin.SOURCE
    const defaultProjectConfig = ConfigUtils.projectsConfigLoadDefault()
    const buildOriginsConfig = ConfigUtils.buildOriginConfigLoad()

    buildOriginsConfig[defaultProjectConfig.name][serviceName][environment] = buildOrigin
    ConfigUtils.buildOriginsConfigSave(buildOriginsConfig)
  }
}
