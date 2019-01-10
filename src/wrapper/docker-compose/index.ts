import {Command} from '@oclif/command'
import chalk from 'chalk'
import {isEmpty} from 'lodash'

import MainConfigService from '../../config/main-config-service'
import BashWrapper from '../bash'

import DockerComposeWrapper from './docker-compose-wrapper'
import ProjectsConfigService from '../../config/projects-config'

export default abstract class extends Command {
  dockerCompose(dryRun = true): DockerComposeWrapper {
    const mainConfigService = new MainConfigService()
    const mainConfig = mainConfigService.mainConfig()

    return new DockerComposeWrapper(
      mainConfig.projectName,
      mainConfig.workDir,
      mainConfig.services,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
  async init() {
    try {
      const projectsConfigService = new ProjectsConfigService()

      if (isEmpty(process.env.ORCHESTRATOR_MAIN_CONFIG_LOCATION) && projectsConfigService.exists() === false && this.id !== 'init') {
        this.error(`Location of <main-config>.json not found. Please see '${chalk.yellow(this.config.name + ' init --help')}' for help.`)
        process.exit(0)
      }
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
