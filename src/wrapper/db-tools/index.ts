import {Command} from '@oclif/command'

import MainConfigService from '../../config/main-config-service'
import BashWrapper from '../bash'

import DbToolsWrapper from './db-tools-wrapper'

export default abstract class extends Command {
  dbTools(dryRun = true): DbToolsWrapper {
    const mainConfigService = new MainConfigService()
    const mainConfig = mainConfigService.mainConfig()

    return new DbToolsWrapper(
      mainConfig.projectName,
      mainConfig.workDir,
      mainConfig.services,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
