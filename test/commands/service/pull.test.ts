import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('pull', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:pull', 'api', '--dry-run'])
    .it('invokes pull with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('pull', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
