import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault,
} from '../../helper/test-helper'

describe('exec', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
  .env(env)
  .stdout()
  .command(['service:exec', '--dry-run', '-edevelopment', 'api', 'bin/bash'])
  .it('invokes exec with known service', ctx => {
    expect(ctx.stdout).to.contain(expectedStdOutForCmd('exec', 'development', ['api', 'bin/bash']))
  })
})
