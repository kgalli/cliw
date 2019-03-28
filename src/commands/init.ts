import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import ConfigUtils from '../config/config-utils'
import ProjectConfig from '../config/project-config'

export default class Init extends Command {
  static description = `initialize and manage project config

  The cli needs to know the location of the main-config.json
file to properly work. The 'init' command is used to determine
this location form the user and store it for later use in the
file: ~/.orchestrator-init-config.json.
  `
  static flags = {
    name: flags.string({
      char: 'n',
      description: 'name used as identifier for project'
    }),
    mainConfig: flags.string({
      char: 'm',
      description: 'location of the main-config.json file'
    }),
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(Init)

    if (ConfigUtils.projectsConfigExists()) {
      this.log('Init config already exists')
      return
    }

    let projectName = flags.name
    if (isEmpty(flags.name)) {
      projectName = await cli.prompt('Please enter the project name')
    }

    let mainConfigLocation = flags.mainConfig
    if (isEmpty(flags.mainConfig)) {
      mainConfigLocation = await cli.prompt('Please enter the location of your <main-config>.json file')
    }

    // TODO validate main config
    // TODO determine internal services to create runTypes array

    const projectConfig = {
      name: projectName,
      mainConfigLocation,
      runTypes: []
    } as ProjectConfig

    ConfigUtils.projectsConfigSave({
      default: projectConfig.name,
      projects: [projectConfig]
    })
  }
}
