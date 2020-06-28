import {defaultProject} from '../../../config'
import {DataSource, DataSourcesConfig} from '../../../types/data-sources-config'

import DataSourceConfigRepo from './data-source-config-repo'

const dataSourcesConfigRepo = new DataSourceConfigRepo(defaultProject.configDir, 'data-sources.yaml')

export function loadDbToolsConfig(): DataSourcesConfig {
  return dataSourcesConfigRepo.load()
}

export function loadDataSourcesByEnvironment(environment: string): DataSource[] {
  return dataSourcesConfigRepo.loadDataSourcesByEnvironment(environment)
}

export function loadDataSourceNames(): string[] {
  return dataSourcesConfigRepo.loadDataSourceNames()
}
