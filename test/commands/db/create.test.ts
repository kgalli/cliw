import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:create', () => {
  test
    .env(env)
    .stdout()
    .command(['db:create', '--service', 'api', '--dry-run'])
    .it('invokes db:create with a known connection', ctx => {
      const expectedOutput = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres psql -h 127.0.0.1 -p 5436 -U kgalli_us -d template1 -c "CREATE DATABASE kgalli_db WITH OWNER kgalli_us ENCODING \'UTF8\' LC_COLLATE = \'en_US.utf8\' LC_CTYPE = \'en_US.utf8\';"'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
})
