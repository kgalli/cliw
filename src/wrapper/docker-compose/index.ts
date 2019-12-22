import BaseCommand from '../../base-command'
import ConfigUtils from '../../config/config-utils'
import BashWrapper from '../bash'

import DockerComposeWrapper from './docker-compose-wrapper'

export default abstract class extends BaseCommand {
  dockerCompose(dryRun = false): DockerComposeWrapper {
    const mainConfig = ConfigUtils.mainConfigLoadDefault()
    const composeConfig = mainConfig.compose
    const projectConfig = ConfigUtils.projectsConfigLoadDefault()
    const buildOriginsConfig = ConfigUtils.buildOriginConfigLoad()
    const servicesBuildOrigin = buildOriginsConfig[projectConfig.name]

    return new DockerComposeWrapper(
      projectConfig.name,
      composeConfig.networkName,
      projectConfig.workDir,
      composeConfig.services,
      servicesBuildOrigin,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
