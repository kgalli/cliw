import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('service:buildorigin', () => {
  context('list', () => {
    // tslint:disable-next-line:no-multi-spaces
    const expectedOutPut =  'ServiceName BuildOrigin \napi         REGISTRY    \ndb          REGISTRY'

    test
      .env(env)
      .stdout()
      .command(['service:buildorigin:list'])
      .it('lists services build origin', ctx => {
        expect(ctx.stdout).to.contain(expectedOutPut)
      })
  })
})