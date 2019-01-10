import ProjectsConfigService from './projects-config'
import {MainConfig} from './main-config'
import MainConfigRepo from './main-config-repo'

const MAIN_CONFIG_TEMPLATE_LOCATION = `${__dirname}/main-config-template.json`

export default class MainConfigService {
  constructor() {
  }

  mainConfig(): MainConfig {
    try {
      const mainConfigLocationEnvVar = process.env.ORCHESTRATOR_MAIN_CONFIG_LOCATION
      let mainConfigLocation = MAIN_CONFIG_TEMPLATE_LOCATION

      if (mainConfigLocationEnvVar) {
        mainConfigLocation = mainConfigLocationEnvVar
      } else {
        const projectsConfigService = new ProjectsConfigService()

        if (projectsConfigService.exists()) {
          const projectConfig = projectsConfigService.loadDefault()

          mainConfigLocation = projectConfig.mainConfigLocation
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
}
