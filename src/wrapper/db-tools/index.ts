import BaseCommand from '../../base-command'
import {mainConfigLoadDefault} from '../../config'
import BashWrapper from '../bash'

import DbToolsWrapper from './db-tools-wrapper'

export default abstract class extends BaseCommand {
  dbTools(dryRun = false): DbToolsWrapper {
    const mainConfig = mainConfigLoadDefault()

    return new DbToolsWrapper(
      mainConfig.dbTools.dataSources,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
