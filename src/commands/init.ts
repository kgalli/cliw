import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import ConfigUtils from '../config/config-utils'
import ProjectConfig, {RunTypeFlag, ServicesRunType} from '../config/project-config'

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

    if (!ConfigUtils.exists(mainConfigLocation as string)) {
      this.error('MainConfig could not be found with the provided location')
    }

    // TODO validate main config
    const mainConfig = ConfigUtils.mainConfigLoad(mainConfigLocation as string)
    const servicesRunType = {} as ServicesRunType

    mainConfig.compose.services.forEach(s => servicesRunType[s.name] = RunTypeFlag.IMAGE)

    const projectConfig = {
      name: projectName,
      mainConfigLocation,
      defaultRunTypeFlag: RunTypeFlag.SRC,
      servicesRunType
    } as ProjectConfig

    ConfigUtils.projectsConfigSave({
      default: projectConfig.name,
      projects: [projectConfig]
    })
  }
}
