import {writeFileSync} from 'fs'

import {BuildOrigin, ProjectBuildOriginConfig} from '../../src/config/build-origins-config'

export function writeBuildOriginsConfig(buildOriginsConfigLocation: string,
                                        projectName: string) {
  const projectBuildOriginConfig = {} as ProjectBuildOriginConfig
  const serviceNames = ['api', 'web', 'db']
  const environment = 'development'

  projectBuildOriginConfig.project = projectName
  projectBuildOriginConfig.services = serviceNames.map(serviceName => ({
    service: serviceName,
    environments: [{
      buildOrigin: BuildOrigin.REGISTRY,
      environment
    }]
  }))

  writeFileSync(buildOriginsConfigLocation, JSON.stringify([projectBuildOriginConfig]))
}
