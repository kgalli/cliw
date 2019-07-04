import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import BashWrapper from '../bash'

import DockerComposeWrapper from './docker-compose-wrapper'

export default abstract class extends BaseCommand {
  dockerCompose(dryRun = true): DockerComposeWrapper {
    const mainConfig = ConfigUtils.mainConfigLoadDefault()
    const composeConfig = mainConfig.compose

    return new DockerComposeWrapper(
      composeConfig.projectName,
      composeConfig.workDir,
      composeConfig.services,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
