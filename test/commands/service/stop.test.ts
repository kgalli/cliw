import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('stop', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:stop', 'api', '--dry-run'])
    .it('runs stop api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('stop', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
