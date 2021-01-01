import {DockerComposeConfig} from '../../../types/docker-compose-config'
import {ImageOriginType, ServiceImageOriginTypes} from '../../../types/service-image-origin-types-config'
import {ServiceParametersPair} from '../../../types/service-parameters-config'
import {ServiceOverrides} from '../../../types/service-overrides-config'

export default class DockerComposeConfigConstructor {
  workDir: string

  network: string

  containerNameTemplate: string

  serviceParametersPairs: ServiceParametersPair[]

  serviceOverrides: ServiceOverrides

  serviceImageOriginTypes: ServiceImageOriginTypes

  dockerComposeConfig: DockerComposeConfig

  constructor(workDir: string,
    containerNameTemplate: string,
    network: string,
    serviceParametersPairs: ServiceParametersPair[],
    dockerComposeConfig: DockerComposeConfig,
    serviceOverrides: ServiceOverrides,
    serviceImageOriginTypes: ServiceImageOriginTypes,
  ) {
    this.workDir = workDir
    this.network = network
    this.containerNameTemplate = containerNameTemplate
    this.serviceParametersPairs = serviceParametersPairs
    this.serviceOverrides = serviceOverrides
    this.dockerComposeConfig = dockerComposeConfig
    this.serviceImageOriginTypes = serviceImageOriginTypes
  }

  constructDockerComposeConfig(): DockerComposeConfig {
    const services = {...this.dockerComposeConfig.services}

    Object.keys(services).forEach(service => {
      const imageOriginType = this.serviceImageOriginTypes[service] || ImageOriginType.REGISTRY

      if (imageOriginType === ImageOriginType.SOURCE) {
        const serviceOverride = this.serviceOverrides[service]

        services[service] = {
          ...services[service],
          ...serviceOverride,
        }

        services[service].image = this.constructContainerName(service)
      } else {
        delete services[service].build
        services[service].image = this.dockerComposeConfig.services[service].image
      }

      services[service].container_name = this.constructContainerName(service)
    })

    const dockerComposeConfigTmp = {
      version: '3.8',
      services,
      networks: {
        default: {
          external: {
            name: this.network,
          },
        },
      },
    }

    return this.replaceParameters(dockerComposeConfigTmp)
  }

  private replaceParameters(dockerComposeConfig: DockerComposeConfig): DockerComposeConfig {
    const dockerComposeConfigCopy = {...dockerComposeConfig}

    this.serviceParametersPairs.forEach(pair => {
      if (pair.name && pair.parameters) {
        let serviceConfig = JSON.stringify(dockerComposeConfigCopy.services[pair.name])

        if (serviceConfig === undefined) {
          return
        }

        pair.parameters.forEach(parameter => {
          serviceConfig = this.replaceTemplateKeyWithValue(serviceConfig, parameter.name, parameter.value)
        })

        dockerComposeConfigCopy.services[pair.name] = JSON.parse(serviceConfig)
      }
    })

    return dockerComposeConfigCopy
  }

  private constructContainerName(service: string): string {
    return this.containerNameTemplate.replace('{{{service}}}', service)
  }

  private replaceTemplateKeyWithValue(config: string, key: string, value: string) {
    return config.replace(`{${key}}`, value)
  }
}
