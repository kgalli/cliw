import {Command} from '@oclif/command'

import ConfigUtils from '../../config/config-utils'
import BashWrapper from '../bash'

import DockerComposeWrapper from './docker-compose-wrapper'

export default abstract class extends Command {
  dockerCompose(dryRun = true): DockerComposeWrapper {
    const mainConfig = ConfigUtils.mainConfigLoadDefault()

    return new DockerComposeWrapper(
      mainConfig.projectName,
      mainConfig.workDir,
      mainConfig.services,
      dryRun,
      new BashWrapper({...BashWrapper.defaultOptions(), dryRun})
    )
  }
}
