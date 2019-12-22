import {writeFileSync} from 'fs'

import {BuildOrigin, BuildOriginsConfig} from '../../src/config/build-origins-config'

export function writeBuildOriginsConfig(buildOriginsConfigLocation: string,
                                        projectName: string) {
  const buildOriginsConfig = {} as BuildOriginsConfig
  const services = ['api', 'web', 'db']
  const environment = 'development'

  buildOriginsConfig[projectName] = {}
  services.forEach(service => {
    buildOriginsConfig[projectName][service] = {}
    buildOriginsConfig[projectName][service][environment] = BuildOrigin.REGISTRY
  })

  writeFileSync(buildOriginsConfigLocation, JSON.stringify(buildOriginsConfig))
}
