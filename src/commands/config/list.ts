import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import ProjectConfig from '../../config/project-config'
import {projectFlag} from '../../flags'

export default class List extends BaseCommand {
  static description = 'list config options'

  static flags = {
    help: flags.help({char: 'h'}),
    project: projectFlag,
  }

  async run() {
    const {flags} = this.parse(List)
    const projectsConfig = ConfigUtils.projectsConfigLoad()
    const projectConfig = projectsConfig.projects
      .find(pc => pc.name === flags.project) as ProjectConfig
    const mainConfig = ConfigUtils.mainConfigLoad(projectConfig.mainConfigLocation)
    const services = mainConfig.services

    this.log('---')
    cli.table([projectConfig], {name: {header: 'ProjectName', minWidth: 7}, mainConfigLocation: {}}, {
      printLine: this.log,
      ...flags, // parsed flags
    })

    this.log('---')

    const data = [] as any
    services.forEach(s => {
      data.push({name: s.name, runType: (projectConfig.servicesRunType[s.name] || projectConfig.defaultRunTypeFlag).toUpperCase()})
    })

    cli.table(data, {name: {header: 'ServiceName', minWidth: 7}, runType: {header: 'Runtype'}}, {
      printLine: this.log,
      ...flags, // parsed flags
    })
  }
}
