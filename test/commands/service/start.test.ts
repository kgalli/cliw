import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('start', () => {
  test
    .env(env)
    //.stdout({print: true})
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:start', 'api', '--dry-run'])
    .it('invokes start with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('start', mainConfig.compose.defaultEnvironment, ['api']))
    })

  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['service:start', 'demoTest', '--dry-run'])
    .catch(err => expect(err.message).to.match(/Expected service demoTest to be one of:/))
    .it('does not invoke start with unknown service')
})
