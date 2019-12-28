import BaseCommand from '../../base-command'
import {
  mainConfigLoad,
  projectsBuildOriginConfigLoadDefault,
  projectsConfigLoadDefault
} from '../../config'
import BashWrapper from '../bash'

import DockerComposeWrapper from './docker-compose-wrapper'

export default abstract class extends BaseCommand {
  dockerCompose(dryRun = false): DockerComposeWrapper {
    const projectConfig = projectsConfigLoadDefault()
    const mainConfig = mainConfigLoad(projectConfig.mainConfigLocation)
    const composeConfig = mainConfig.compose
    const projectBuildOriginConfig = projectsBuildOriginConfigLoadDefault()
    const serviceBuildOrigins = projectBuildOriginConfig.services

    return new DockerComposeWrapper(
      projectConfig.name,
      composeConfig.networkName,
      projectConfig.workDir,
      composeConfig.services,
      serviceBuildOrigins,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
