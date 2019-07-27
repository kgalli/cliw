import {cli} from 'cli-ux'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'

export default class ProjectList extends BaseCommand {
  static description = 'list projects'

  static flags = {
    ...cli.table.flags()
  }

  async run() {
    const {flags} = this.parse(ProjectList)
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    cli.table(projectsConfig.projects, {
      name: {
        minWidth: 7,
      },
      mainConfigLocation: {}
    }, {
      printLine: this.log,
      ...flags, // parsed flags
    })

  }
}
