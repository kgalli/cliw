import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('exec', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:exec', '--dry-run', 'api', 'bin/bash'])
    .it('invokes exec with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('exec', mainConfig.compose.defaultEnvironment, ['api', 'bin/bash']))
    })
})
