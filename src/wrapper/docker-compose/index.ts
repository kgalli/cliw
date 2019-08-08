import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import BashWrapper from '../bash'

import DockerComposeWrapper from './docker-compose-wrapper'

export default abstract class extends BaseCommand {
  dockerCompose(dryRun = false): DockerComposeWrapper {
    const mainConfig = ConfigUtils.mainConfigLoadDefault()
    const composeConfig = mainConfig.compose
    // TODO find a better way to store and retrieve buildOrigin
    const projectConfig = ConfigUtils.projectsConfigLoadDefault()
    const servicesBuildOrigin = projectConfig.servicesBuildOrigin

    return new DockerComposeWrapper(
      composeConfig.projectName,
      composeConfig.networkName,
      composeConfig.workDir,
      composeConfig.services,
      servicesBuildOrigin,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
