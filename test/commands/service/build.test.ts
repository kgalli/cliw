import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  mainConfig,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('build', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:build', 'api', '--dry-run'])
    .it('invokes build with a known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('build', mainConfig.compose.defaultEnvironment, []))
    })
})
