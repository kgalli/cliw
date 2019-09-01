import {flags} from '@oclif/command'
import {isEmpty} from 'lodash'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import ProjectConfig from '../../config/project-config'

export default class ProjectRemove extends BaseCommand {
  static description = 'remove project'

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
    const {args} = this.parse(ProjectRemove)
    const projectToRemoveName = args.project
    const defaultProjectsConfig = ConfigUtils.projectsConfigLoadDefault()
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    if (projectToRemoveName === defaultProjectsConfig.name && projectsConfig.projects.length > 1) {
      this.error('Project is currently defined as default. Please set another default and try again.')
    }

    const projectToRemove: ProjectConfig = projectsConfig
      .projects
      .find!(projectConfig => projectConfig.name === projectToRemoveName) || {} as ProjectConfig

    if (isEmpty(projectToRemove)) {
      this.error(`Project ${projectToRemove} could not be found.`)
    }

    const indexOfProjectToRemove = projectsConfig.projects.indexOf(projectToRemove)

    projectsConfig.projects.splice(indexOfProjectToRemove, 1)

    if (projectsConfig.projects.length === 0) {
      ConfigUtils.projectsConfigDelete()
    } else {
      ConfigUtils.projectsConfigSave(projectsConfig)
    }
  }
}
