import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('up', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:up', 'api', '--dry-run'])
    .it('runs up api', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('up', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
