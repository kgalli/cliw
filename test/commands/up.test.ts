import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../helper/test-helper'

describe('up', () => {
  test
    .env(env)
    .stdout()
    .command(['up', '--services', 'api', '--dryRun'])
    .it('runs up --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('up', mainConfig.defaultEnvironment, ['api']))
    })
})
