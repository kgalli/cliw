import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import {projectsConfigExists, projectsConfigInitialize} from '../config'

export default class Init extends Command {
  static description = `Create and setup default project and configuration.

  [cliw] supports the 'orchestration' of multiple projects.
Therefore it needs to maintain the path to the configuration directory
(location of e.g. service-metadata.yaml, service-runtime.yaml
service-parameters.yaml, docker-compose.yaml and db-parameters) and the
working directory. The latter is e.g. used as checkout path of the defined
services.

Called without options the 'init' command is executed in interactive mode
to gather the information needed directly from the prompt.

Data in stored in projects-config.json at: ~/.config/ (default).
  `

  static flags = {
    name: flags.string({
      char: 'n',
      description: 'project unique identifier (name)',
    }),
    'config-directory': flags.string({
      char: 'c',
      description: 'absolute location of the configuration directory',
    }),
    'working-directory': flags.string({
      char: 'w',
      description: 'absolute location of the working directory',
    }),
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Init)

    if (projectsConfigExists()) {
      this.log('Init was already run. Use `project:list` sub command for details')
      return
    }

    const projectName = isEmpty(flags.name) ?
      await cli.prompt('Please enter the project name') :
      flags.name

    const configDir = isEmpty(flags['config-directory']) ?
      await cli.prompt('Please enter the absolute path to your configuration directory') :
      flags['config-directory']

    const workDir = isEmpty(flags['working-directory']) ?
      await cli.prompt('Please enter the absolute path to your working directory') :
      flags['working-directory']

    try {
      projectsConfigInitialize(projectName, configDir, workDir)
    } catch (error) {
      this.error(error.message, error)
    }
  }
}
