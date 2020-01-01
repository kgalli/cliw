import FileUtils from '../../../utils/file-utils'

import {BuildOrigin, BuildOriginConfig} from './build-origins-config'
import ServiceConfig, {CodeSource} from './service-config'

export default class ServiceConfigHelper {
  mainConfigLocation: string
  buildOriginConfigLocation: string

  constructor(defaultConfigurationPath: string, mainConfigLocation: string) {
    this.buildOriginConfigLocation = `${defaultConfigurationPath}/service-build-origins.json`
    this.mainConfigLocation = mainConfigLocation
  }

  loadServiceConfig(): ServiceConfig {
    const mainConfig = FileUtils.load(this.mainConfigLocation, 'ServiceConfig')

    return mainConfig.compose as ServiceConfig
  }

  loadBuildOriginConfig(): BuildOriginConfig {
    const buildOriginConfig = FileUtils.loadWithFallback(this.buildOriginConfigLocation, {})

    return buildOriginConfig as BuildOriginConfig
  }

  loadBuildOrigin(service: string, environment: string): BuildOrigin {
    const buildOriginConfig = this.loadBuildOriginConfig()

    const serviceBuildOriginConfig = buildOriginConfig[service]

    if (serviceBuildOriginConfig) {
      const environmentBuildOrigin = serviceBuildOriginConfig[environment]

      return environmentBuildOrigin
        ? environmentBuildOrigin
        : BuildOrigin.REGISTRY
    }

    return BuildOrigin.REGISTRY
  }

  updateBuildOrigin(serviceName: string, environment: string, buildOrigin: BuildOrigin): BuildOriginConfig {
    const externalServiceNames = this.loadServiceConfig().services
      .filter(service => service.source === CodeSource.EXTERNAL)
      .map(service => service.name)

    if (externalServiceNames.includes(serviceName)) {
      throw new Error(`Can not set build origin for service '${serviceName}' as it is flagged as 'external'.`)
    }

    const buildOriginConfig = this.loadBuildOriginConfig()
    const serviceBuildOriginConfig = buildOriginConfig[serviceName]

    if (!serviceBuildOriginConfig) {
      buildOriginConfig[serviceName] = {}
    }

    buildOriginConfig[serviceName][environment] = buildOrigin

    return this.saveBuildOriginConfig(buildOriginConfig)
  }

  private saveBuildOriginConfig(buildOriginConfig: BuildOriginConfig): BuildOriginConfig {
    FileUtils.writeJson(buildOriginConfig, this.buildOriginConfigLocation)

    return buildOriginConfig
  }
}
