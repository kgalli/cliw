import {DataSource, DataSourcesConfig} from '../../../types/data-sources-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'data-sources.yaml'

export default class DataSourceConfigRepo extends YamlConfigFileRepo<DataSourcesConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }

  loadDataSourcesByEnvironment(environment: string): DataSource[] {
    return this.load().dataSources
    .map(item => {
      const dataSourceName = item.name
      const dataSource = item.environments.find(env => env.name === environment)

      if (dataSource) {
        dataSource.name = dataSourceName
      }
      return dataSource
    })
    .filter(dataSource => dataSource !== undefined) as DataSource[]
  }

  loadDataSourceNames(): string[] {
    return this.load().dataSources.map(dataSource => dataSource.name)
  }
}
