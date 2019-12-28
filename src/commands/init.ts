import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import {projectsConfigExists, projectsConfigInitialize} from '../config'

export default class Init extends Command {
  static description = `initialize projects config

  The cli supports the 'orchestration' of multiple projects.
Therefore it needs to know the location of the corresponding
main-config.json file. The 'init' command is used to determine
this location form the user and store it together with the project
identifier (project name) at: ~/.config/projects-config.json.
  `
  static flags = {
    name: flags.string({
      char: 'n',
      description: 'project unique identifier (name)'
    }),
    config: flags.string({
      char: 'c',
      description: 'location of the configuration file (*.json)'
    }),
    'working-directory': flags.string({
      char: 'w',
      description: 'absolute location of the working directory'
    }),
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Init)

    if (projectsConfigExists()) {
      this.log('Initial project already exists. Use `cliw project:list` command for details')
      return
    }

    const projectName = isEmpty(flags.name)
      ? await cli.prompt('Please enter the project name')
      : flags.name

    const mainConfigLocation = isEmpty(flags.config)
      ? await cli.prompt('Please enter the location of your <main-config>.json file')
      : flags.config

    const workDirLocation = isEmpty(flags['working-directory'])
      ? await cli.prompt('Please enter the absolute path to your working directory')
      : flags['working-directory']

    projectsConfigInitialize(projectName, mainConfigLocation, workDirLocation)
  }
}
