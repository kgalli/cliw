import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('restart', () => {
  test
    .env(env)
    //.stdout({print: true})
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:restart', 'api', '--dry-run'])
    .it('invokes start with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('restart', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
