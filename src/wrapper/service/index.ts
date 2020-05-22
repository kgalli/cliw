import BaseCommand from '../../base-command'
import {DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject} from '../../config'
import ServiceWrapper from '../../types'
import ServiceRuntimeConfigRepo from '../service/config/service-runtime-config-repo'

import DockerComposeConfigRepo from './config/docker-compose-config-repo'
import ServiceImageOriginTypeConfigRepo from './config/service-image-origin-types-config-repo'
import ServiceParameterConfigRepo from './config/service-parameter-config-repo'
import DockerComposeWrapper from './docker-compose'
import DockerComposeCmdConstructor from './docker-compose/cmd-constructer'
import DockerComposeConfigConstructor from './docker-compose/config-constructor'

export default abstract class extends BaseCommand {
  service(dryRun: boolean, environment: string): ServiceWrapper {
    const projectConfig = defaultProject

    const runtimeConfig = new ServiceRuntimeConfigRepo(projectConfig.mainConfigPath).load()
    const parameterConfig = new ServiceParameterConfigRepo(projectConfig.mainConfigPath).load()
    const serviceImageOriginTypesConfig = new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT).load()
    const dockerComposeConfig = new DockerComposeConfigRepo(projectConfig.mainConfigPath).load()

    const serviceParametersPairs = parameterConfig.services
    const serviceImageOriginPairs = runtimeConfig.services
    const environmentServiceImageOriginTypes = serviceImageOriginTypesConfig
      .environments
      .find(env => env.name === environment)

    const serviceImageOriginTypePairs = environmentServiceImageOriginTypes
      ? environmentServiceImageOriginTypes.services
      : []

    const dockerComposeConfigConstructor = new DockerComposeConfigConstructor(
      projectConfig.workDir,
      `${defaultProject.name}_{{{service}}}_${environment}`,
      `${defaultProject.name}_${environment}`,
      serviceParametersPairs,
      serviceImageOriginPairs,
      serviceImageOriginTypePairs,
      dockerComposeConfig
    )
    const dockerComposeCmdConstructor = new DockerComposeCmdConstructor(projectConfig.name, projectConfig.workDir)

    return new DockerComposeWrapper(
      projectConfig.workDir,
      `docker-compose.${defaultProject.name}.${environment}.yaml`,
      dockerComposeCmdConstructor,
      dockerComposeConfigConstructor,
      // tslint:disable-next-line:no-console
      cmd => { console.log(`TODO: Use acutal shell callback! \nDryRun: (${dryRun})\nCmd: ${cmd}`) },
    )
  }

  imageOriginConfig(): ServiceImageOriginTypeConfigRepo {
    return new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT)
  }
}
