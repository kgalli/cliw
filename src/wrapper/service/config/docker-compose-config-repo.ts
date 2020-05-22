import {DockerComposeConfig} from '../../../types/docker-compose-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_LOCATION = 'docker-compose.yaml'

export default class DockerComposeConfigRepo extends YamlConfigFileRepo<DockerComposeConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_LOCATION) {
    super(configLocation, configFileName)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }
}
