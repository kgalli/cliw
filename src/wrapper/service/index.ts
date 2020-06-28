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

    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, projectConfig.configDir)

    const runtimeConfig = new ServiceRuntimeConfigRepo(projectConfig.configDir).load()

    const parameterConfig = (
      environment === runtimeConfig.defaultEnvironment ?
        new ServiceParameterConfigRepo(projectConfig.configDir) :
        new ServiceParameterConfigRepo(projectConfig.configDir, `service-parameters.${environment}.yaml`)
    ).load()

    const dockerComposeConfig = new DockerComposeConfigRepo(projectConfig.configDir).load()
    const serviceImageOriginTypesConfig = new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT).load()

    const serviceParametersPairs = parameterConfig.services
    const serviceImageOriginPairs = runtimeConfig.services
    const environmentServiceImageOriginTypes = serviceImageOriginTypesConfig
    .environments
    .find(env => env.name === environment)

    const serviceImageOriginTypePairs = environmentServiceImageOriginTypes ?
      environmentServiceImageOriginTypes.services :
      []

    const dockerComposeConfigConstructor = new DockerComposeConfigConstructor(
      projectConfig.workDir,
      `${defaultProject.name}_{{{service}}}_${environment}`,
      `${defaultProject.name}_${environment}`,
      serviceParametersPairs,
      serviceImageOriginPairs,
      serviceImageOriginTypePairs,
      dockerComposeConfig
    )

    const dockerComposeProjectName = `${projectConfig.name}_${environment}`
    const dockerComposeConfigFileName = `docker-compose.${defaultProject.name}.${environment}.yaml`
    const dockerComposeConfigFileLocation = join(projectConfig.workDir, dockerComposeConfigFileName)
    const dockerComposeCmdConstructor = new DockerComposeCmdConstructor(
      dockerComposeProjectName, dockerComposeConfigFileLocation
    )

    return new DockerComposeWrapper(
      projectConfig.workDir,
      dockerComposeConfigFileName,
      dockerComposeCmdConstructor,
      dockerComposeConfigConstructor,
      shellCallback({dryRun, logger: this.log})
    )
  }

  imageOriginConfig(): ServiceImageOriginTypeConfigRepo {
    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject.configDir)

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
