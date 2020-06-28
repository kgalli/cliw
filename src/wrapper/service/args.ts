import {defaultProject} from '../../config'

import DockerComposeConfigRepo from './config/docker-compose-config-repo'

const dockerComposeConfig = new DockerComposeConfigRepo(defaultProject.configDir).load()
const services = Object.keys(dockerComposeConfig.services)

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
