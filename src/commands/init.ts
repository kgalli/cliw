import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {isEmpty} from 'lodash'

import {BuildOrigin, BuildOriginsConfig} from '../config/build-origins-config'
import ConfigUtils from '../config/config-utils'
import ProjectConfig from '../config/project-config'
import ProjectsConfig from '../config/projects-config'

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

    const projectName = isEmpty(flags.name)
      ? await cli.prompt('Please enter the project name')
      : flags.name

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

    const projectConfig = {
      name: projectName,
      workDir: workDirLocation,
      mainConfigLocation,
    } as ProjectConfig

    const projectsConfig = {
      default: projectName,
      projects: [projectConfig]
    } as ProjectsConfig

    ConfigUtils.projectsConfigSave(projectsConfig)

    const mainConfig = ConfigUtils.mainConfigLoad(mainConfigLocation as string)
    const buildOriginsConfig = {} as BuildOriginsConfig

    buildOriginsConfig[projectName] = {}
    mainConfig.compose.services.forEach(s => {
      buildOriginsConfig[projectName][s.name] = {}
      mainConfig.compose.environments.forEach(
        environment => buildOriginsConfig[projectName][s.name][environment] = BuildOrigin.REGISTRY
      )
    })

    ConfigUtils.buildOriginsConfigSave(buildOriginsConfig)
  }
}
