import {ServiceParameterConfig} from '../../../types/service-parameters-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'service-parameters.yaml'

export default class ServiceParameterConfigRepo extends YamlConfigFileRepo<ServiceParameterConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }
}
