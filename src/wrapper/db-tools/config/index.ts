import {defaultProject} from '../../../config'
import {DataSource, DataSourcesConfig} from '../../../types/data-sources-config'

import DataSourceConfigRepo from './data-source-config-repo'

const dataSourcesConfigRepo = defaultProject.configDir
  ? new DataSourceConfigRepo(defaultProject.configDir, 'data-sources.yaml')
  : undefined

export function loadDbToolsConfig(): DataSourcesConfig {
  if (!dataSourcesConfigRepo) {
    return {} as DataSourcesConfig
  }

  return dataSourcesConfigRepo.load()
}

export function loadDataSourcesByEnvironment(environment: string): DataSource[] {
  if (!dataSourcesConfigRepo) {
    return []
  }

  return dataSourcesConfigRepo.loadDataSourcesByEnvironment(environment)
}

export function loadDataSourceNames(): string[] {
  if (!dataSourcesConfigRepo) {
    return []
  }

  return dataSourcesConfigRepo.loadDataSourceNames()
}
