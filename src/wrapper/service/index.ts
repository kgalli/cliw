import BaseCommand from '../../base-command'
import {DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject} from '../../config'
import BashWrapper from '../bash'

import ServiceConfigHelper from './config'
import ServiceWrapper from './service-wrapper'

export default abstract class extends BaseCommand {
  service(dryRun = false): ServiceWrapper {
    const projectConfig = defaultProject
    const serviceConfigHelper = new ServiceConfigHelper(
      DEFAULT_CONFIG_PATH_ACTIVE_PROJECT,
      projectConfig.mainConfigLocation
    )

    return new ServiceWrapper(
      projectConfig.name,
      projectConfig.workDir,
      serviceConfigHelper,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
