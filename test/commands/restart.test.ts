import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../helper/test-helper'

describe('restart', () => {
  test
    .env(env)
    //.stdout({print: true})
    .stdout()
    .command(['restart', '--services', 'api', '--dryRun'])
    .it('invokes start with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('restart', mainConfig.defaultEnvironment, ['api']))
    })
})
