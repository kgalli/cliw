import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsAndBuildOriginsConfig} from '../../helper/test-helper'

describe('stop', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsAndBuildOriginsConfig())
    .command(['service:stop', 'api', '--dry-run'])
    .it('runs stop api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('stop', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
