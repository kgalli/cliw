import BaseCommand from '../../base-command'
import {defaultProject} from '../../config'
import BashWrapper from '../bash'

import {loadDbToolsConfig} from './config'
import DbToolsWrapper from './db-tools-wrapper'

export default abstract class extends BaseCommand {
  dbTools(dryRun = false): DbToolsWrapper {
    const projectConfig = defaultProject
    const dbToolsConfig = loadDbToolsConfig(projectConfig.configDir)

    return new DbToolsWrapper(
      dbToolsConfig.dataSources,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
