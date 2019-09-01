import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:create', () => {
  test
    .env(env)
    .stdout()
    .command(['db:create', 'api', '--dry-run'])
    .it('invokes docker cmd to create database', ctx => {
      const expectedOutput = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres psql -h 127.0.0.1 -p 5436 -U kgalli_us -d template1 -c "CREATE DATABASE kgalli_db WITH OWNER kgalli_us ENCODING \'UTF8\' LC_COLLATE = \'en_US.utf8\' LC_CTYPE = \'en_US.utf8\';"'

      expect(ctx.stdout).to.contain(expectedOutput)
    })

  test
    .env(env)
    .stdout()
    .command(['db:create', 'api', '--environment', 'production', '--dry-run'])
    .catch(err => expect(err.message).to.match(/Command "create" is not supported in a readonly connection/))
    .it('raises an error due to readonly data source')
})
