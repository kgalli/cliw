import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../helper/test-helper'

describe('exec', () => {
  test
    .env(env)
    .stdout()
    .command(['service:exec', 'bin/bash', '--service', 'api', '--dry-run'])
    .it('invokes exec with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('exec', mainConfig.compose.defaultEnvironment, ['api', 'bin/bash']))
    })
})
