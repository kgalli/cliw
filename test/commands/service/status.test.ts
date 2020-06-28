import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('status', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:status', '-edevelopment', '--dry-run'])
    .it('runs status api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('status', 'development', []))
    })
})
