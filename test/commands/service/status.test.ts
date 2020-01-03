import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('status', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:status', 'api', '--dry-run'])
    .it('runs status api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('status', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
