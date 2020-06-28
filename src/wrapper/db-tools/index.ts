import BaseCommand from '../../base-command'
import BashWrapper from '../bash'

import {loadDataSourcesByEnvironment} from './config'
import DbToolsWrapper from './db-tools-wrapper'

export default abstract class extends BaseCommand {
  dbTools(dryRun = false, environment: string): DbToolsWrapper {
    const dataSources = loadDataSourcesByEnvironment(environment)

    return new DbToolsWrapper(
      dataSources,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
