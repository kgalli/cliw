import {ServiceOverridesConfig} from '../../../types/service-overrides-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'service-overrides.yaml'

export default class ServiceOverridesConfigRepo extends YamlConfigFileRepo<ServiceOverridesConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }
}
