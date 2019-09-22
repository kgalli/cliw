import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import ConfigUtils from '../config/config-utils'
import ProjectConfig, {BuildOrigin, ServicesBuildOrigin} from '../config/project-config'

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

    if (ConfigUtils.projectsConfigExists()) {
      this.log('Initial project already exists. Use `cliw project:list` command for details')
      return
    }

    let projectName = flags.name
    if (isEmpty(flags.name)) {
      projectName = await cli.prompt('Please enter the project name')
    }

    let mainConfigLocation = flags.config
    if (isEmpty(flags.config)) {
      mainConfigLocation = await cli.prompt('Please enter the location of your <main-config>.json file')
    }

    if (!ConfigUtils.exists(mainConfigLocation as string)) {
      this.error('MainConfig could not be found with the provided location')
    }

    let workDirLocation = flags['working-directory']
    if (isEmpty(flags['working-directory'])) {
      workDirLocation = await cli.prompt('Please enter the absolute path to your working directory')
    }

    if (!ConfigUtils.exists(workDirLocation as string)) {
      this.error('Working directory could not be found with at the provided location')
    }
    // TODO validate main config
    const mainConfig = ConfigUtils.mainConfigLoad(mainConfigLocation as string)
    const servicesBuildOrigin = {} as ServicesBuildOrigin

    mainConfig.compose.services.forEach(s => servicesBuildOrigin[s.name] = BuildOrigin.REGISTRY)

    const projectConfig = {
      name: projectName,
      workDir: workDirLocation,
      mainConfigLocation,
      defaultBuildOrigin: BuildOrigin.REGISTRY,
      servicesBuildOrigin
    } as ProjectConfig

    ConfigUtils.projectsConfigSave({
      default: projectConfig.name,
      projects: [projectConfig]
    })
  }
}
