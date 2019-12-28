import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import {projectsConfigSetDefault} from '../../config'

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
    const project = args.project

    projectsConfigSetDefault(project)
  }
}
