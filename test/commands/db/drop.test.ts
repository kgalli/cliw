import {expect, test} from '@oclif/test'

import {env, removeProjectsConfigDefault, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('db:drop', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  context('PostgreSQL', () => {
    test
      .env(env)
      .stdout()
      .command(['db:drop', 'api', '--dry-run'])
      .it('invokes docker cmd to drop database', ctx => {
        const expectedOutput = 'docker run --rm --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres psql -h 127.0.0.1 -p 5436 -U kgalli_us -d template1 -c "DROP DATABASE IF EXISTS kgalli_db;"'

        expect(ctx.stdout).to.contain(expectedOutput)
      })

    test
      .env(env)
      .stdout()
      .command(['db:drop', 'api', '--environment', 'production', '--dry-run'])
      .catch(err => expect(err.message).to.match(/Command "drop" is not supported in a readonly connection/))
      .it('raises an error due to readonly data source')
  })

  context('MySQL', () => {
    test
      .env(env)
      .stdout()
      .command(['db:drop', 'api-mysql', '--dry-run'])
      .it('invokes docker cmd to drop database', ctx => {
        const expectedOutput = 'docker run --rm -i --net=host -v $PWD:/opt -w /opt mysql mysql -h 127.0.0.1 -P 3306 -u kgalli_us -pkgalli_pw -D kgalli_db -e "DROP SCHEMA IF EXISTS kgalli_db;"'

        expect(ctx.stdout).to.contain(expectedOutput)
      })

    test
      .env(env)
      .stdout()
      .command(['db:drop', 'api-mysql', '--environment', 'production', '--dry-run'])
      .catch(err => expect(err.message).to.match(/Command "drop" is not supported in a readonly connection/))
      .it('raises an error due to readonly data source')
  })
})
