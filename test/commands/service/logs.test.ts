import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../../helper/test-helper'

describe('logs', () => {
  test
    .env(env)
    .stdout()
    .command(['service:logs', 'api', '--dry-run'])
    .it('invokes logs with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.compose.defaultEnvironment, ['api']))
    })

  test
    .env(env)
    .stdout()
    .command(['service:logs', 'api', '--follow', '--dry-run'])
    .it('invokes logs with follow flag', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.compose.defaultEnvironment, ['--follow', 'api']))
    })

  test
    .env(env)
    .stdout()
    .command(['service:logs', 'api', '--timestamps', '--dry-run'])
    .it('invokes logs with timestamps flag', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.compose.defaultEnvironment, ['--timestamps', 'api']))
    })
})
