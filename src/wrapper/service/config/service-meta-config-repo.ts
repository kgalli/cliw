import {ServiceMetadataConfig} from '../../../types/service-metadata-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'service-metadata.yaml'

export default class ServiceMetaConfigRepo extends YamlConfigFileRepo<ServiceMetadataConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  load() {
    const serviceMetadataConfig = super.load()
    const errorMessagePrefix = 'invalid service-metadata.yaml:'

    if (!serviceMetadataConfig.environments) {
      throw new Error(`${errorMessagePrefix} missing environment property -- environment: ["development", "test"]`)
    }

    if (!serviceMetadataConfig.defaultEnvironment) {
      throw new Error(`${errorMessagePrefix}  missing default_environment property -- default_environment: "development"`)
    }

    if (!serviceMetadataConfig.environments.find(env => env === serviceMetadataConfig.defaultEnvironment)) {
      throw new Error(`${errorMessagePrefix} environments property does not contain ${serviceMetadataConfig.defaultEnvironment} (default_environment)`)
    }

    if (!serviceMetadataConfig.services || !Array.isArray(serviceMetadataConfig.services)) {
      throw new Error(`${errorMessagePrefix} missing services definition -- service: []`)
    }

    serviceMetadataConfig.services.forEach(service => {
      if (service.repositoryUrl) {
        service.directory = this.extractDirectoryFromRepositoryUrl(service.repositoryUrl)
      }
    })

    const invalidServices = serviceMetadataConfig.services.filter(service => service.directory === undefined && service.source === 'internal')
    let errorMessage = 'invalid service-metadata.yaml: \n'

    invalidServices.forEach(service => {
      errorMessage += `service ${service.name} does not have property directory defined\n`
    })

    if (invalidServices.length > 0) {
      throw new Error(errorMessage)
    }

    return serviceMetadataConfig
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }

  private extractDirectoryFromRepositoryUrl(repositoryUrl: string): string  {
    const pathWithExtension = repositoryUrl.split('/').pop() as string
    const path = pathWithExtension.split('.').shift() as string

    return path
  }
}
