import {expect, test} from '@oclif/test'

import {
  env,
  expectedStdOutForCmd,
  removeProjectsConfigDefault,
  writeProjectsConfigDefault,
} from '../../helper/test-helper'

describe('service:image', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  context(':list', () => {
    const expectedOutPut = 'Service ImageOrigin \n' +
      'api     REGISTRY    \n' +
      'db      REGISTRY'

    test
    .env(env)
    .stdout()
    .command(['service:image:list'])
    .it('lists services build origin', ctx => {
      expect(ctx.stdout).to.contain(expectedOutPut)
    })
  })

  context(':pull', () => {
    test
    .env(env)
    .stdout()
    .command(['service:image:pull', 'api', '-edevelopment', '--dry-run'])
    .it('invokes pull with known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('pull', 'development', ['api']))
    })
  })
})
