import {expect, test} from '@oclif/test'

import {env} from '../test-helper'

describe('db', () => {
  context('db:console', () => {
    test
      .env(env)
      .stdout()
      .command(['db:console', '-s', 'api'])
      .it('runs db:console -s api', ctx => {
        expect(ctx.stdout).to.contain('console development')
      })
  })
})
