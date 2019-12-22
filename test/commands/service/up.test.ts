import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsAndBuildOriginsConfig} from '../../helper/test-helper'

describe('up', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsAndBuildOriginsConfig())
    .command(['service:up', 'api', '--dry-run'])
    .it('runs up api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('up', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
