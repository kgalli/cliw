import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault
} from '../../helper/test-helper'

describe('logs', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['service:logs', 'api', '--dry-run', '-edevelopment'])
    .it('invokes logs with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', 'development', ['api']))
    })

  test
    .env(env)
    .stdout()
    .command(['service:logs', 'api', '--follow', '--dry-run', '-edevelopment'])
    .it('invokes logs with follow flag', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', 'development', ['--follow', 'api']))
    })

  test
    .env(env)
    .stdout()
    .command(['service:logs', 'api', '--timestamps', '--dry-run', '-edevelopment'])
    .it('invokes logs with timestamps flag', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', 'development', ['--timestamps', 'api']))
    })
})
