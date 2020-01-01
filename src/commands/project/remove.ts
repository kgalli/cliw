import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import {projectsConfigRemoveProject} from '../../config'

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
    const projectToRemove = args.project

    try {
      projectsConfigRemoveProject(projectToRemove)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
