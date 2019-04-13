import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import {RunTypeFlag} from '../../config/project-config'
import {environmentFlag, projectFlag, serviceFlag} from '../../flags'

export default class Set extends BaseCommand {
  static description = 'Set config options'

  static flags = {
    help: flags.help({char: 'h'}),
    project: projectFlag,
    service: serviceFlag,
    environment: environmentFlag,
  }

  static args = [
    {
      name: 'key',
      required: true,
      description: 'options key to set',
      options: ['buildtype']
    },
    {
      name: 'value',
      required: true,
      description: 'value of options key to set',
      options: [RunTypeFlag.IMAGE, RunTypeFlag.SRC]
    },
  ]

  async run() {
    const {flags, args} = this.parse(Set)
    const runTypeFlag = args.value === RunTypeFlag.IMAGE.toString() ? RunTypeFlag.IMAGE : RunTypeFlag.SRC
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    projectsConfig.projects.forEach(project => {
      if (project.name === flags.project) {
        project.servicesRunType[flags.service] = runTypeFlag
      }
    });

    ConfigUtils.projectsConfigSave(projectsConfig)
  }
}
