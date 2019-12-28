import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

import BaseCommand from '../../../base-command'
import {
  extractBuildOrigin,
  mainConfigLoad,
  projectsBuildOriginConfigLoadDefault,
  projectsConfigLoadDefault
} from '../../../config'
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
    const environment = flags.environment
    const defaultProjectConfig = projectsConfigLoadDefault()
    const buildOriginsConfig = projectsBuildOriginConfigLoadDefault()

    const mainConfig = mainConfigLoad(defaultProjectConfig.mainConfigLocation)
    const services = mainConfig.compose.services
    const data = [] as any
    services.forEach(s => {
      const buildOrigin = extractBuildOrigin(buildOriginsConfig.services, s.name, environment)

      if (!flags.services || flags.services.includes(s.name)) {
        data.push({name: s.name, buildOrigin: (buildOrigin).toUpperCase()})
      }
    })

    cli.table(data, {name: {header: 'ServiceName', minWidth: 7}, buildOrigin: {header: 'BuildOrigin'}}, {
      printLine: this.log
    })
  }
}
