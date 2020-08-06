import {defaultProject} from '../../config'

import DockerComposeConfigRepo from './config/docker-compose-config-repo'

const services = defaultProject.configDir ?
  Object.keys(new DockerComposeConfigRepo(defaultProject.configDir).load().services) :
  []

export const servicesArg = {
  name: 'services',
  required: false,
  description: 'Service name(s) defined in docker-compose.yaml [default: ALL...].',
  options: services,
}

export const serviceArg = {
  name: 'service',
  required: true,
  description: 'service name',
  options: services,
}
