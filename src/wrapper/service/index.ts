import {join} from 'path'

import BaseCommand from '../../base-command'
import {DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject} from '../../config'
import ServiceWrapper from '../../types'
import ServiceRuntimeConfigRepo from '../service/config/service-runtime-config-repo'
import {shellCallback} from '../shell'

import DockerComposeConfigRepo from './config/docker-compose-config-repo'
import ServiceImageOriginTypeConfigRepo from './config/service-image-origin-types-config-repo'
import ServiceParameterConfigRepo from './config/service-parameter-config-repo'
import DockerComposeWrapper from './docker-compose'
import DockerComposeCmdConstructor from './docker-compose/cmd-constructer'
import DockerComposeConfigConstructor from './docker-compose/config-constructor'

export default abstract class extends BaseCommand {
  service(dryRun: boolean, environment: string): ServiceWrapper {
    const projectConfig = defaultProject

    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, projectConfig.mainConfigPath)

    const runtimeConfig = new ServiceRuntimeConfigRepo(projectConfig.mainConfigPath).load()
    const parameterConfig = new ServiceParameterConfigRepo(projectConfig.mainConfigPath).load()
    const dockerComposeConfig = new DockerComposeConfigRepo(projectConfig.mainConfigPath).load()
    const serviceImageOriginTypesConfig = new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT).load()

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

    const dockerComposeConfigFileName = `docker-compose.${defaultProject.name}.${environment}.yaml`
    const dockerComposeCmdConstructor = new DockerComposeCmdConstructor(projectConfig.name, join(projectConfig.workDir, dockerComposeConfigFileName))

    return new DockerComposeWrapper(
      projectConfig.workDir,
      dockerComposeConfigFileName,
      dockerComposeCmdConstructor,
      dockerComposeConfigConstructor,
      // tslint:disable-next-line:no-console
      shellCallback({dryRun, logger: this.log})
    )
  }

  imageOriginConfig(): ServiceImageOriginTypeConfigRepo {
    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject.mainConfigPath)

    return new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT)
  }

  private initializeImageOriginTypesConfig(configPathActiveProject: string, mainConfigPath: string) {
    const serviceImageOriginTypesConfigRepo = new ServiceImageOriginTypeConfigRepo(configPathActiveProject)

    if (!serviceImageOriginTypesConfigRepo.exists()) {
      const runtimeConfig = new ServiceRuntimeConfigRepo(mainConfigPath).load()
      serviceImageOriginTypesConfigRepo.init(
        runtimeConfig.environments, runtimeConfig.services.map(service => service.name)
      )
    }
  }
}
