import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'

export default class ProjectSetDefault extends BaseCommand {
  static description = 'set default project'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [
    {
      name: 'project',
      required: true,
      description: 'project specified by name'
    }
  ]

  async run() {
    const {args} = this.parse(ProjectSetDefault)
    const projectName = args.project
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
