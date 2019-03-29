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
})
