import {flags} from '@oclif/command'

import BaseCommand from '../../../base-command'
import ConfigUtils from '../../../config/config-utils'
import {RunTypeFlag} from '../../../config/project-config'
import {environmentFlag, servicesFlag} from '../../../wrapper/docker-compose/flags'

export default class SetRunType extends BaseCommand {
  static description = 'set service(s) runtype'

  static flags = {
    help: flags.help({char: 'h'}),
    services: {...servicesFlag, required: true},
    environment: environmentFlag,
  }

  static args = [
    {
      name: 'value',
      required: true,
      description: 'runtype value',
      options: [RunTypeFlag.IMAGE, RunTypeFlag.SRC]
    },
  ]

  static examples = [
    '$ cliw service:runtype:set image -s api'
  ]

  async run() {
    const {flags, args} = this.parse(SetRunType)
    const runTypeFlag = args.value === RunTypeFlag.IMAGE.toString() ? RunTypeFlag.IMAGE : RunTypeFlag.SRC
    const defaultProjectConfig = ConfigUtils.projectsConfigLoadDefault()
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    projectsConfig.projects.forEach(projectConfig => {
      if (projectConfig.name === defaultProjectConfig.name) {
        flags.services.forEach(serviceName => {
          projectConfig.servicesRunType[serviceName] = runTypeFlag
        })
      }
    })

    ConfigUtils.projectsConfigSave(projectsConfig)
  }
}
