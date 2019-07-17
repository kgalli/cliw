import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../../helper/test-helper'

describe('up', () => {
  test
    .env(env)
    .stdout()
    .command(['service:up', '--services', 'api', '--dry-run'])
    .it('runs up --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('up', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
