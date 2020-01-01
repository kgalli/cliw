import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('stop', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:stop', 'api', '--dry-run'])
    .it('runs stop api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('stop', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
