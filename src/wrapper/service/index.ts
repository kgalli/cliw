import {join} from 'path'

import BaseCommand from '../../base-command'
import {DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject} from '../../config'
import ServiceWrapper from '../../types'
import ServiceOverridesConfigRepo from '../service/config/service-overrides-config-repo'
import {shellCallback} from '../shell'

import DockerComposeConfigRepo from './config/docker-compose-config-repo'
import ServiceImageOriginTypeConfigRepo from './config/service-image-origin-types-config-repo'
import ServiceParameterConfigRepo from './config/service-parameter-config-repo'
import DockerComposeWrapper from './docker-compose'
import DockerComposeCmdConstructor from './docker-compose/cmd-constructer'
import DockerComposeConfigConstructor from './docker-compose/config-constructor'
import ServiceMetaConfigRepo from './config/service-meta-config-repo'
import {ServiceBuildConfig} from '../../types/service-overrides-config'

export default abstract class extends BaseCommand {
  service(dryRun: boolean, environment: string): ServiceWrapper {
    const projectConfig = defaultProject

    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, projectConfig.configDir)

    const serviceMetadataConfig = new ServiceMetaConfigRepo(projectConfig.configDir).load()

    const parameterConfig = (
      environment === serviceMetadataConfig.defaultEnvironment ?
        new ServiceParameterConfigRepo(projectConfig.configDir) :
        new ServiceParameterConfigRepo(projectConfig.configDir, `service-parameters.${environment}.yaml`)
    ).load()

    const dockerComposeConfig = new DockerComposeConfigRepo(projectConfig.configDir).load()
    const serviceOverrides = new ServiceOverridesConfigRepo(projectConfig.configDir).load()
    const serviceImageOriginTypesConfig = new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT).load()

    const serviceParametersPairs = parameterConfig.services
    const serviceImageOriginPairs = {} as { [service: string]: { image: string; build: ServiceBuildConfig}}

    Object.keys(dockerComposeConfig.services)
    .forEach((service: string) => {
      serviceImageOriginPairs[service] = {} as { image: string; build: ServiceBuildConfig}
      serviceImageOriginPairs[service].image = dockerComposeConfig.services[service].image

      if (serviceOverrides.services[service]) {
        serviceImageOriginPairs[service].build = serviceOverrides.services[service].build
      }
    })

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
      dockerComposeConfig,
    )

    const dockerComposeProjectName = `${projectConfig.name}_${environment}`
    const dockerComposeConfigFileName = `docker-compose.${defaultProject.name}.${environment}.yaml`
    const dockerComposeConfigFileLocation = join(projectConfig.workDir, dockerComposeConfigFileName)
    const dockerComposeCmdConstructor = new DockerComposeCmdConstructor(
      dockerComposeProjectName, dockerComposeConfigFileLocation,
    )

    return new DockerComposeWrapper(
      projectConfig.workDir,
      dockerComposeConfigFileName,
      dockerComposeCmdConstructor,
      dockerComposeConfigConstructor,
      shellCallback({dryRun, logger: this.log}),
    )
  }

  imageOriginConfig(): ServiceImageOriginTypeConfigRepo {
    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject.configDir)

    return new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT)
  }

  private initializeImageOriginTypesConfig(configPathActiveProject: string, mainConfigPath: string) {
    const serviceImageOriginTypesConfigRepo = new ServiceImageOriginTypeConfigRepo(configPathActiveProject)

    if (!serviceImageOriginTypesConfigRepo.exists()) {
      const serviceMetadataConfig = new ServiceMetaConfigRepo(mainConfigPath).load()
      serviceImageOriginTypesConfigRepo.init(
        serviceMetadataConfig.environments, serviceMetadataConfig.services.map(service => service.name),
      )
    }
  }
}
