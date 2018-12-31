import {Command} from '@oclif/command'
import chalk from 'chalk'
import {isEmpty} from 'lodash'

import InitConfigRepo from './config/init-config-repo'
import {MainConfig, MainConfigRepo} from './config/main-config-repo'
import BashShell from './wrapper/bash'
import DockerComposeWrapper from './wrapper/docker-compose'

const MAIN_CONFIG_TEMPLATE_LOCATION = `${__dirname}/config/main-config-template.json`

function mainConfig(): MainConfig {
  try {
    const mainConfigLocationEnvVar = process.env.ORCHESTRATOR_MAIN_CONFIG_LOCATION
    let mainConfigLocation = MAIN_CONFIG_TEMPLATE_LOCATION

    if (mainConfigLocationEnvVar) {
      mainConfigLocation = mainConfigLocationEnvVar
    } else {
      const initConfigRepo = new InitConfigRepo()

      if (initConfigRepo.exists()) {
        mainConfigLocation = initConfigRepo.load().mainConfigLocation
      }
    }

    const mainConfigRepo = new MainConfigRepo(mainConfigLocation)
    const mainConfig = mainConfigRepo.load()

    return mainConfig
  } catch (e) {
    // tslint:disable-next-line no-console
    console.error(e.message)
    return process.exit(1)
  }
}

export default abstract class extends Command {
  dockerCompose(dryRun = true) {
    return new DockerComposeWrapper(
      mainConfig().projectName,
      mainConfig().workDir,
      mainConfig().services,
      this.shell(dryRun)
    )
  }

  shell(dryRun: boolean) {
    return new BashShell({...BashShell.defaultOptions(), dryRun})
  }

  async init() {
    try {
      const initConfigRepo = new InitConfigRepo()

      if (isEmpty(process.env.ORCHESTRATOR_MAIN_CONFIG_LOCATION) && initConfigRepo.exists() === false && this.id !== 'init') {
        this.error(`Location of <main-config>.json not found. Please see '${chalk.yellow(this.config.name + ' init --help')}' for help.`)
        process.exit(0)
      }
    } catch (e) {
      this.error(e.message, e)
    }
  }
}
