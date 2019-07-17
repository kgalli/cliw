import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:drop', () => {
  test
    .env(env)
    .stdout()
    .command(['db:drop', '--service', 'api', '--dry-run'])
    .it('invokes db:drop with a known connection', ctx => {
      const expectedOutput = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres psql -h 127.0.0.1 -p 5436 -U kgalli_us -d template1 -c "DROP DATABASE IF EXISTS kgalli_db;"'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
})
