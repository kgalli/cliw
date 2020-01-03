import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('run', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:run', '--dry-run', 'api', 'bin/bash'])
    .it('runs "bin/bash" command inside api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('run', mainConfig.compose.defaultEnvironment, ['api', 'bin/bash']))
    })
})
