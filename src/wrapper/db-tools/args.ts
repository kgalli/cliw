import {loadDataSourceNames} from './config'

export const dataSourceNameArg = {
  name: 'datasource',
  required: true,
  description: 'data source specified by name',
  options: loadDataSourceNames(),
}
