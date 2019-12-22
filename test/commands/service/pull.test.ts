import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsAndBuildOriginsConfig} from '../../helper/test-helper'

describe('pull', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsAndBuildOriginsConfig())
    .command(['service:pull', 'api', '--dry-run'])
    .it('invokes pull with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('pull', mainConfig.compose.defaultEnvironment, ['api']))
    })
})
