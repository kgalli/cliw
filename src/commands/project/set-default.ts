import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'

export default class ProjectSetDefault extends BaseCommand {
  static description = 'set default project'

  static flags = {
    name: flags.string({
      char: 'n',
      required: true,
      description: 'name used as identifier for project'
    }),
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(ProjectSetDefault)
    const projectName = flags.name
    const projectsConfig = ConfigUtils.projectsConfigLoad()
    const projectExists = projectsConfig.projects
      .map(project => project.name)
      .includes(projectName)

    if (!projectExists) {
      return this.error(`Project with name ${projectName} does not exist. Default project did not change.`)
    }

    projectsConfig.default = projectName
    ConfigUtils.projectsConfigSave(projectsConfig)
  }
}
