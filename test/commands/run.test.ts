import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../test-helper'

describe('run', () => {
  test
    .env(env)
    .stdout()
    .command(['run', 'bin/bash', '--service', 'api'])
    .it('runs run "bin/bash" --service api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('run', mainConfig.defaultEnvironment, ['api', 'bin/bash']))
    })
})
