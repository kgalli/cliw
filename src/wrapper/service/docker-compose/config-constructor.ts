import {DockerComposeConfig} from '../../../types/docker-compose-config'
import {ImageOriginType, ServiceImageOriginTypePair} from '../../../types/service-image-origin-types-config'
import {ServiceParametersPair} from '../../../types/service-parameters-config'
import {ImageOrigin, ServiceImageOriginPair} from '../../../types/service-runtime-config'

interface ServiceImageOriginMap {
  [service: string]: ImageOrigin
}

interface ServiceImageOriginTypeMap {
  [service: string]: ImageOriginType
}

export default class DockerComposeConfigConstructor {
  workDir: string
  network: string
  containerNameTemplate: string
  serviceParametersPairs: ServiceParametersPair[]
  serviceImageOriginPairs: ServiceImageOriginPair[]
  serviceImageOriginTypePairs: ServiceImageOriginTypePair[]
  dockerComposeConfig: DockerComposeConfig

  constructor(workDir: string, // needed later for setup of image build via source
              containerNameTemplate: string,
              network: string,
              serviceParametersPairs: ServiceParametersPair[],
              serviceImageOriginPairs: ServiceImageOriginPair[],
              serviceImageOriginTypePairs: ServiceImageOriginTypePair[],
              dockerComposeConfig: DockerComposeConfig) {
    this.workDir = workDir
    this.network = network
    this.containerNameTemplate = containerNameTemplate
    this.serviceParametersPairs = serviceParametersPairs
    this.serviceImageOriginPairs = serviceImageOriginPairs
    this.serviceImageOriginTypePairs = serviceImageOriginTypePairs
    this.dockerComposeConfig = dockerComposeConfig
  }

  constructDockerComposeConfig(): DockerComposeConfig {
    const services = {...this.dockerComposeConfig.services}
    const serviceImageOriginMap = {} as ServiceImageOriginMap
    const serviceImageOriginTypeMap = {} as ServiceImageOriginTypeMap

    this.serviceImageOriginPairs.forEach(service => {
      serviceImageOriginMap[service.name] = service.imageOrigin
    })

    this.serviceImageOriginTypePairs.forEach(pair => {
      serviceImageOriginTypeMap[pair.name] = pair.imageOriginType
    })

    Object.keys(services).forEach(service => {
      const imageOriginType = serviceImageOriginTypeMap[service] || ImageOriginType.REGISTRY
      const serviceImageOrigin = serviceImageOriginMap[service]

      if (serviceImageOrigin) {
        if (imageOriginType === ImageOriginType.SOURCE) {
          const serviceBuildProperties = {...serviceImageOrigin.source}

          delete serviceBuildProperties.mergeProperties

          services[service] = {
            ...services[service],
            ...serviceBuildProperties,
            ...serviceImageOrigin.source.mergeProperties
          }
        } else {
          services[service].image = serviceImageOrigin.registry.image
        }
      }

      services[service].container_name = this.constructContainerName(service)
    })

    const dockerComposeConfigTmp = {
      version: '3.8',
      services,
      networks: {
        default: {
          external: {
            name: this.network
          }
        }
      }
    }

    return this.replaceParameters(dockerComposeConfigTmp)
  }

  private replaceParameters(dockerComposeConfig: DockerComposeConfig): DockerComposeConfig {
    const dockerComposeConfigCopy = {...dockerComposeConfig}

    this.serviceParametersPairs.forEach(pair => {
      if (pair.name && pair.parameters) {
        let serviceConfig = JSON.stringify(dockerComposeConfigCopy.services[pair.name])

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
