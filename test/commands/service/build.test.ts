import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsAndBuildOriginsConfig} from '../../helper/test-helper'

describe('build', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsAndBuildOriginsConfig())
    .command(['service:build', 'api', '--dry-run'])
    .it('invokes build with a known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('build', mainConfig.compose.defaultEnvironment, []))
    })
})
