import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../test-helper'

describe('status', () => {
  test
    .env(env)
    .stdout()
    .command(['status', '--services', 'api'])
    .it('runs status --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('status', mainConfig.defaultEnvironment, ['api']))
    })
})
