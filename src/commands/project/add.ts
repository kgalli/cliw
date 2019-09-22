import {flags} from '@oclif/command'

import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import ProjectConfig, {BuildOrigin, ServicesBuildOrigin} from '../../config/project-config'

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
    const projectsConfig = ConfigUtils.projectsConfigLoad()

    if (!ConfigUtils.exists(mainConfigLocation as string)) {
      this.error('MainConfig could not be found with the provided location')
    }

    if (!ConfigUtils.exists(workDir as string)) {
      this.error(`Working directory could not be found at ${workDir}`)
    }

    const mainConfig = ConfigUtils.mainConfigLoad(mainConfigLocation as string)
    const servicesBuildOrigin = {} as ServicesBuildOrigin

    mainConfig.compose.services.forEach(s => servicesBuildOrigin[s.name] = BuildOrigin.REGISTRY)

    const projectConfig = {
      name: projectName,
      workDir,
      mainConfigLocation,
      defaultBuildOrigin: BuildOrigin.REGISTRY,
      servicesBuildOrigin
    } as ProjectConfig

    projectsConfig.projects.push(projectConfig)
    ConfigUtils.projectsConfigSave(projectsConfig)
  }
}
