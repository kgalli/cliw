import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import ProjectConfig, {BuildOrigin, ServicesBuildOrigin} from '../../config/project-config'

export default class ProjectAdd extends BaseCommand {
  static description = 'add project'

  static flags = {
    name: flags.string({
      char: 'n',
      required: true,
      description: 'name used as identifier for project'
    }),
    config: flags.string({
      char: 'c',
      required: true,
      description: 'location of the configuration file (*.json)'
    }),
    help: flags.help({char: 'h'})
  }

  async run() {
    const {flags} = this.parse(ProjectAdd)
    const projectName = flags.name
    const mainConfigLocation = flags.config
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    if (!ConfigUtils.exists(mainConfigLocation as string)) {
      this.error('MainConfig could not be found with the provided location')
    }

    const mainConfig = ConfigUtils.mainConfigLoad(mainConfigLocation as string)
    const servicesBuildOrigin = {} as ServicesBuildOrigin

    mainConfig.compose.services.forEach(s => servicesBuildOrigin[s.name] = BuildOrigin.REGISTRY)

    const projectConfig = {
      name: projectName,
      mainConfigLocation,
      defaultBuildOrigin: BuildOrigin.REGISTRY,
      servicesBuildOrigin
    } as ProjectConfig

    projectsConfig.projects.push(projectConfig)
    ConfigUtils.projectsConfigSave(projectsConfig)
  }
}
