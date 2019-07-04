import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../helper/test-helper'

describe('run', () => {
  test
    .env(env)
    .stdout()
    .command(['run', 'bin/bash', '--service', 'api', '--dryRun'])
    .it('runs run "bin/bash" --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('run', mainConfig.compose.defaultEnvironment, ['api', 'bin/bash']))
    })
})
