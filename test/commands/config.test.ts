import {expect, test} from '@oclif/test'

import {env} from '../helper/test-helper'

describe('config', () => {
  context('list', () => {
    // tslint:disable-next-line:no-multi-spaces
    const expectedOutPut =  '---\nServiceName Runtype \napi         IMAGE   \ndb          IMAGE'

    test
      .env(env)
      .stdout()
      .command(['config:list', '--project', 'test'])
      .it('lists services run-types', ctx => {
        expect(ctx.stdout).to.contain(expectedOutPut)
      })
  })
})
