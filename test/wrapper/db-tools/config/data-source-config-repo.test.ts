import {expect} from 'chai'

import DataSourceConfigRepo from '../../../../src/wrapper/db-tools/config/data-source-config-repo'
import {TEST_CONFIG_DIR_PATH} from '../../../helper/test-helper'

describe('DataSourceConfigRepo', () => {
  const subject = new DataSourceConfigRepo(TEST_CONFIG_DIR_PATH)

  it('.loadDataSourcesByEnvironment', () => {
    const dataSources = subject.loadDataSourcesByEnvironment('production')

    expect(dataSources.length).to.eql(2)
    expect(dataSources.map(dataSource => dataSource.name)).to.eql(['api', 'api-mysql'])
    expect(dataSources.map(dataSources => dataSources.readonly)).to.eql([true, true])
  })

  it('.loadDataSourcesByEnvironment', () => {
    const dataSources = subject.loadDataSourceNames()

    expect(dataSources.length).to.eql(2)
    expect(dataSources).to.eql(['api', 'api-mysql'])
  })
})
