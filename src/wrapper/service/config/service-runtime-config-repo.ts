import {ServiceRuntimeConfig} from '../../../types/service-runtime-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'service-runtime.yaml'

export default class ServiceRuntimeConfigRepo extends YamlConfigFileRepo<ServiceRuntimeConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }
}
