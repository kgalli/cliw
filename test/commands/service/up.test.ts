import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('up', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:up', 'api', '--dry-run'])
    .it('runs up api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('up', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
