import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:console', () => {
  test
    .env(env)
    .stdout()
    .command(['db:console', '--service', 'api', '--dry-run'])
    .it('invokes db:console with a known connection', ctx => {
      const expectedOutput = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt postgres psql -h 127.0.0.1 -p 5436 -U kgalli_us -d kgalli_db'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
})
