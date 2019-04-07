import {expect, test} from '@oclif/test'

import {env} from '../helper/test-helper'

describe('config', () => {
  context('list', () => {
    const expectedOutPut = '---\nServiceName Runtype \napi         IMAGE   \nweb         IMAGE   \n'

    test
      .env(env)
      .stdout()
      .command(['config:list', '--project', 'test'])
      .it('lists services run-types', ctx => {
        expect(ctx.stdout).to.contain(expectedOutPut)
      })
  })
})
