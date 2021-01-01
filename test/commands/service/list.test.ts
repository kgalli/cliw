import {expect, test} from '@oclif/test'

import {
  env,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault,
} from '../../helper/test-helper'

describe('list', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
  .env(env)
  .stdout()
  .command(['service:list'])
  .it('runs status api', ctx => {
    expect(ctx.stdout).to.contain(
      'Name   Description         Source   \n' +
      'api    API service         internal \n' +
      'db     PostgreSQL database external ',
    )
  })
})
