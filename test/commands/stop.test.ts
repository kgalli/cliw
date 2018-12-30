import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../test-helper'

describe('stop', () => {
  test
    .env(env)
    .stdout()
    .command(['stop', '--services', 'api'])
    .it('runs stop --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('stop', mainConfig.defaultEnvironment, ['api']))
    })
})
