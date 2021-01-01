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
import {ServiceImageOriginTypes} from '../../types/service-image-origin-types-config'
import FileNotFoundError from '../../utils/file-not-found-error'
import {ServiceOverrides} from '../../types/service-overrides-config'
import {ServiceMetadata, ServiceMetadataConfig} from '../../types/service-metadata-config'

export default abstract class extends BaseCommand {
  service(dryRun: boolean, environment: string): ServiceWrapper {
    const projectConfig = defaultProject

    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, projectConfig.configDir)

    const serviceMetadataConfig = this.loadServiceMetaConfig(projectConfig.configDir)

    const parameterConfig = (
      environment === serviceMetadataConfig.defaultEnvironment ?
        new ServiceParameterConfigRepo(projectConfig.configDir) :
        new ServiceParameterConfigRepo(projectConfig.configDir, `service-parameters.${environment}.yaml`)
    ).load()
    const serviceParametersPairs = parameterConfig.services

    const dockerComposeConfig = new DockerComposeConfigRepo(projectConfig.configDir).load()
    const serviceImageOriginTypes = this.loadServiceImageOriginTypes(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, environment)
    const serviceOverrides = this.loadServiceOverrides(projectConfig.configDir)
    const eligibleServiceOverrides = this.constructEligibleServiceOverrides(serviceMetadataConfig, serviceOverrides)

    const dockerComposeConfigConstructor = new DockerComposeConfigConstructor(
      projectConfig.workDir,
      `${defaultProject.name}_{{{service}}}_${environment}`,
      `${defaultProject.name}_${environment}`,
      serviceParametersPairs,
      dockerComposeConfig,
      eligibleServiceOverrides,
      serviceImageOriginTypes,
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

  servicesMetadata(): ServiceMetadata[] {
    const projectConfig = defaultProject

    return this.loadServiceMetaConfig(projectConfig.configDir).services
  }

  imageOriginConfig(): ServiceImageOriginTypeConfigRepo {
    this.initializeImageOriginTypesConfig(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT, defaultProject.configDir)

    return new ServiceImageOriginTypeConfigRepo(DEFAULT_CONFIG_PATH_ACTIVE_PROJECT)
  }

  private initializeImageOriginTypesConfig(configPathActiveProject: string, mainConfigPath: string) {
    const serviceImageOriginTypesConfigRepo = new ServiceImageOriginTypeConfigRepo(configPathActiveProject)

    // TODO implement mechanism so we not only create when missing but also re-create/update once more services
    // have been added
    // --> smartest way to deal with this is whenever a update happens to write a new file taking existing
    // config into account if there is one -- this will also save us from all the file checks during
    // cli "boot" like this one
    if (!serviceImageOriginTypesConfigRepo.exists()) {
      const serviceMetadataConfig = new ServiceMetaConfigRepo(mainConfigPath).load()
      serviceImageOriginTypesConfigRepo.init(
        serviceMetadataConfig.environments, serviceMetadataConfig.services.map(service => service.name),
      )
    }
  }

  private loadServiceMetaConfig(configDir: string): ServiceMetadataConfig {
    return new ServiceMetaConfigRepo(configDir).load()
  }

  private loadServiceOverrides(configDir: string): ServiceOverrides {
    try {
      const serviceOverridesConfig = new ServiceOverridesConfigRepo(configDir).load()

      return serviceOverridesConfig.services || {}
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        return {}
      }
      throw error
    }
  }

  private constructEligibleServiceOverrides(
    serviceMetadataConfig: ServiceMetadataConfig,
    serviceOverrides: ServiceOverrides,
  ): ServiceOverrides {
    const services = serviceMetadataConfig.services.filter(service => service.source === 'internal')

    const invalidServices = services.filter(service => service.directory === undefined)

    invalidServices.forEach(service => console.log(`service-metadata.yaml ${service.name} does not have property relative_path defined`))

    const eligibleServiceOverrides = {} as ServiceOverrides

    services.forEach(service => {
      eligibleServiceOverrides[service.name] = serviceOverrides[service.name] || this.constructDefaultServiceOverride(service.directory)
    })

    return eligibleServiceOverrides
  }

  private constructDefaultServiceOverride(context: string) {
    return {
      build: {
        context: context,
        dockerfile: 'Dockerfile',
        target: 'source',
      },
    }
  }

  private loadServiceImageOriginTypes(configDir: string, environment: string): ServiceImageOriginTypes {
    return new ServiceImageOriginTypeConfigRepo(configDir).load_by_environment(environment)
  }
}
