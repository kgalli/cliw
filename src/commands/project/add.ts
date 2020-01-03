import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import {projectsConfigAddProject} from '../../config'

export default class ProjectAdd extends BaseCommand {
  static description = 'add project'

  static flags = {
    config: flags.string({
      char: 'c',
      required: true,
      description: 'location of the configuration file (*.json)'
    }),
    'working-directory': flags.string({
      char: 'w',
      required: true,
      description: 'absolute location of the working directory'
    }),
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
    const {args, flags} = this.parse(ProjectAdd)
    const projectName = args.project
    const mainConfigLocation = flags.config
    const workDir = flags['working-directory']

    try {
      projectsConfigAddProject(projectName, mainConfigLocation, workDir)
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
