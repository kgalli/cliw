import {flags} from '@oclif/command'

import BaseCommand from '../../../base-command'
import ConfigUtils from '../../../config/config-utils'
import {BuildOrigin} from '../../../config/project-config'
import {environmentFlag, servicesFlag} from '../../../wrapper/docker-compose/flags'

export default class BuildOriginSet extends BaseCommand {
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
      options: [BuildOrigin.REGISTRY, BuildOrigin.SOURCE]
    },
  ]

  static examples = [
    '$ cliw service:buildorigin:set source -s api'
  ]

  async run() {
    const {flags, args} = this.parse(BuildOriginSet)
    const buildOrigin = args.value === BuildOrigin.REGISTRY.toString() ? BuildOrigin.REGISTRY : BuildOrigin.SOURCE
    const defaultProjectConfig = ConfigUtils.projectsConfigLoadDefault()
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    projectsConfig.projects.forEach(projectConfig => {
      if (projectConfig.name === defaultProjectConfig.name) {
        flags.services.forEach(serviceName => {
          projectConfig.servicesBuildOrigin[serviceName] = buildOrigin
        })
      }
    })

    ConfigUtils.projectsConfigSave(projectsConfig)
  }
}
