import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault,
} from '../../helper/test-helper'

describe('start', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
  .env(env)
  // .stdout({print: true})
  .stdout()
  .command(['service:start', 'api', '-edevelopment', '--dry-run'])
  .it('invokes start with known service', ctx => {
    expect(ctx.stdout).to.contain(expectedStdOutForCmd('start', 'development', ['api']))
  })

  test
  .env(env)
  .stdout()
  .command(['service:start', 'demoTest', '-edevelopment', '--dry-run'])
  .catch(error => expect(error.message).to.contain('Expected demoTest to be one of:'))
  .it('does not invoke start with unknown service')
})
