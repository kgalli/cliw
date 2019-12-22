import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsAndBuildOriginsConfig} from '../../helper/test-helper'

describe('exec', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsAndBuildOriginsConfig())
    .command(['service:exec', '--dry-run', 'api', 'bin/bash'])
    .it('invokes exec with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('exec', mainConfig.compose.defaultEnvironment, ['api', 'bin/bash']))
    })
})
