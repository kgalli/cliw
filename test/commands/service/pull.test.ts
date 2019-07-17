import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../../helper/test-helper'

describe('pull', () => {
  test
    .env(env)
    .stdout()
    .command(['service:pull', '--services', 'api', '--dry-run'])
    .it('invokes pull with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('pull', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
