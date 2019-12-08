import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('exec', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:exec', '--dry-run', 'api', 'bin/bash'])
    .it('invokes exec with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('exec', mainConfig.compose.defaultEnvironment, ['api', 'bin/bash']))
    })
})
