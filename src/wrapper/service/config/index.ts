import FileUtils from '../../../utils/file-utils'

import {BuildOrigin, BuildOriginConfig} from './build-origins-config'
import ServiceConfig from './service-config'

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

  updateBuildOrigin(service: string, environment: string, buildOrigin: BuildOrigin): BuildOriginConfig {
    const buildOriginConfig = this.loadBuildOriginConfig()
    const serviceBuildOriginConfig = buildOriginConfig[service]

    if (!serviceBuildOriginConfig) {
      buildOriginConfig[service] = {}
    }

    buildOriginConfig[service][environment] = buildOrigin

    return this.saveBuildOriginConfig(buildOriginConfig)
  }

  private saveBuildOriginConfig(buildOriginConfig: BuildOriginConfig): BuildOriginConfig {
    FileUtils.writeJson(buildOriginConfig, this.buildOriginConfigLocation)

    return buildOriginConfig
  }
}
