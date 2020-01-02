import {expect, test} from '@oclif/test'

import {env, removeProjectsConfigDefault, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('service:origin', () => {
  context('list', () => {
    before(() => writeProjectsConfigDefault())
    after(() => removeProjectsConfigDefault())

    // tslint:disable-next-line:no-multi-spaces
    const expectedOutPut =  'ServiceName BuildOrigin \napi         REGISTRY    \ndb          REGISTRY'

    test
      .env(env)
      .stdout()
      .command(['service:origin:list'])
      .it('lists services build origin', ctx => {
        expect(ctx.stdout).to.contain(expectedOutPut)
      })
  })
})
