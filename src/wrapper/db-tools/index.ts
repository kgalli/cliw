import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import BashWrapper from '../bash'

import DbToolsWrapper from './db-tools-wrapper'

export default abstract class extends BaseCommand {
  dbTools(dryRun = true): DbToolsWrapper {
    const mainConfig = ConfigUtils.mainConfigLoadDefault()

    return new DbToolsWrapper(
      mainConfig.projectName,
      mainConfig.workDir,
      mainConfig.services,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
