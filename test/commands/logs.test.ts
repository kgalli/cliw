import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../helper/test-helper'

describe('logs', () => {
  test
    .env(env)
    .stdout()
    .command(['logs', '--services', 'api', '--dryRun'])
    .it('invokes logs with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.defaultEnvironment, ['api']))
    })

  test
    .env(env)
    .stdout()
    .command(['logs', '--services', 'api', '--follow', '--dryRun'])
    .it('invokes logs with follow flag', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.defaultEnvironment, ['--follow', 'api']))
    })

  test
    .env(env)
    .stdout()
    .command(['logs', '--services', 'api', '--timestamps', '--dryRun'])
    .it('invokes logs with timestamps flag', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.defaultEnvironment, ['--timestamps', 'api']))
    })
})
