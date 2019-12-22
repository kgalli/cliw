import {expect, test} from '@oclif/test'

import {env, writeProjectsAndBuildOriginsConfig} from '../../helper/test-helper'

describe('service:origin', () => {
  context('list', () => {
    // tslint:disable-next-line:no-multi-spaces
    const expectedOutPut =  'ServiceName BuildOrigin \napi         REGISTRY    \ndb          REGISTRY'

    test
      .env(env)
      .stdout()
      .do(() => writeProjectsAndBuildOriginsConfig())
      .command(['service:origin:list'])
      .it('lists services build origin', ctx => {
        expect(ctx.stdout).to.contain(expectedOutPut)
      })
  })
})
