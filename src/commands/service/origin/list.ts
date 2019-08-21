import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

import BaseCommand from '../../../base-command'
import ConfigUtils from '../../../config/config-utils'
import {environmentFlag, servicesFlag} from '../../../wrapper/docker-compose/flags'

export default class BuildOriginList extends BaseCommand {
  static description = 'list service(s) origin SOURCE|REGISTRY'

  static flags = {
    help: flags.help({char: 'h'}),
    services: {...servicesFlag, required: false},
    environment: environmentFlag,
  }

  async run() {
    const {flags} = this.parse(BuildOriginList)
    const defaultProjectConfig = ConfigUtils.projectsConfigLoadDefault()

    const mainConfig = ConfigUtils.mainConfigLoad(defaultProjectConfig.mainConfigLocation)
    const services = mainConfig.compose.services
    const data = [] as any
    services.forEach(s => {
      if (!flags.services || flags.services.includes(s.name)) {
        data.push({name: s.name, buildOrigin: (defaultProjectConfig.servicesBuildOrigin[s.name] || defaultProjectConfig.defaultBuildOrigin).toUpperCase()})
      }
    })

    cli.table(data, {name: {header: 'ServiceName', minWidth: 7}, buildOrigin: {header: 'BuildOrigin'}}, {
      printLine: this.log
    })
  }
}
