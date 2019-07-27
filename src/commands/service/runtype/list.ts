import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

import BaseCommand from '../../../base-command'
import ConfigUtils from '../../../config/config-utils'
import {environmentFlag, servicesFlag} from '../../../wrapper/docker-compose/flags'

export default class ListRunType extends BaseCommand {
  static description = 'list service(s) runtype'

  static flags = {
    help: flags.help({char: 'h'}),
    services: {...servicesFlag, required: false},
    environment: environmentFlag,
  }

  async run() {
    const {flags} = this.parse(ListRunType)
    const defaultProjectConfig = ConfigUtils.projectsConfigLoadDefault()

    const mainConfig = ConfigUtils.mainConfigLoad(defaultProjectConfig.mainConfigLocation)
    const services = mainConfig.compose.services
    const data = [] as any
    services.forEach(s => {
      if (!flags.services || flags.services.includes(s.name)) {
        data.push({name: s.name, runType: (defaultProjectConfig.servicesRunType[s.name] || defaultProjectConfig.defaultRunTypeFlag).toUpperCase()})
      }
    })

    cli.table(data, {name: {header: 'ServiceName', minWidth: 7}, runType: {header: 'Runtype'}}, {
      printLine: this.log
    })
  }
}
