import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../test-helper'

describe('logs', () => {
  test
    .env(env)
    .stdout()
    .command(['logs', '--services', 'api'])
    .it('invokes logs with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('logs', mainConfig.defaultEnvironment, ['api']))
    })
})
