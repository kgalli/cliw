import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../test-helper'

describe('build', () => {
  test
    .env(env)
    .stdout()
    .command(['build', '--services', 'api'])
    .it('invokes build with a known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('build', mainConfig.defaultEnvironment, []))
    })
})
