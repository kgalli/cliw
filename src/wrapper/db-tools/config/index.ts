import {defaultProject} from '../../../config'
import {DataSource, DataSourcesConfig} from '../../../types/data-sources-config'

import DataSourceConfigRepo from './data-source-config-repo'

const dataSourcesConfigRepo = new DataSourceConfigRepo(defaultProject.configDir, 'data-sources.yaml')

export function loadDbToolsConfig(): DataSourcesConfig {
  return dataSourcesConfigRepo.load()
}

export function loadDataSourcesByEnvironment(environment: string): DataSource[] {
  return loadDbToolsConfig().dataSources
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

export function loadDataSourceNames(): string[] {
  return loadDbToolsConfig().dataSources.map(dataSource => dataSource.name)
}
