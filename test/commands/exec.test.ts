import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../test-helper'

describe('exec', () => {
  test
    .env(env)
    .stdout()
    .command(['exec', 'bin/bash', '--service', 'api'])
    .it('invokes exec with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('exec', mainConfig.defaultEnvironment, ['api', 'bin/bash']))
    })
})
