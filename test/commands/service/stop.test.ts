import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../../helper/test-helper'

describe('stop', () => {
  test
    .env(env)
    .stdout()
    .command(['service:stop', '--services', 'api', '--dry-run'])
    .it('runs stop --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('stop', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
