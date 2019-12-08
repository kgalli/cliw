import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('build', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:build', 'api', '--dry-run'])
    .it('invokes build with a known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('build', mainConfig.compose.defaultEnvironment, []))
    })
})
