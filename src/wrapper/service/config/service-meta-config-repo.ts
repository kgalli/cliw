import {ServiceMetadataConfig} from '../../../types/service-metadata-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'service-metadata.yaml'

export default class ServiceMetaConfigRepo extends YamlConfigFileRepo<ServiceMetadataConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }
}
