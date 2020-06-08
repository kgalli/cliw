import {defaultProject} from '../../config'

import ServiceRuntimeConfigRepo from './config/service-runtime-config-repo'

const runtimeConfig = new ServiceRuntimeConfigRepo(defaultProject.configDir).load()
const services = runtimeConfig.services.map(service => service.name)

export const servicesArg = {
  name: 'services',
  required: false,
  description: 'Service name(s) defined in service-runtime.yaml [default: ALL...].',
  options: services,
}

export const serviceArg = {
  name: 'service',
  required: true,
  description: 'service name',
  options: services,
}
