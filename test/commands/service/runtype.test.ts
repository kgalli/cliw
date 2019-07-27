import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('service:runtype', () => {
  context('list', () => {
    // tslint:disable-next-line:no-multi-spaces
    const expectedOutPut =  'ServiceName Runtype \napi         IMAGE   \ndb          IMAGE'

    test
      .env(env)
      .stdout()
      .command(['service:runtype:list'])
      .it('lists services run-types', ctx => {
        expect(ctx.stdout).to.contain(expectedOutPut)
      })
  })
})
