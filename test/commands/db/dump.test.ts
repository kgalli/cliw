import {expect, test} from '@oclif/test'

import {env, removeProjectsConfigDefault, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('db:dump', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  context('PostgreSQL', () => {
    test
    .env(env)
    .stdout()
    .command(['db:dump', 'api', '-t', 'kgalli-development.dump', '--dry-run'])
    .it('invokes docker cmd to dump database', ctx => {
      const expectedOutput = 'docker run --rm -t --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres pg_dump -h 127.0.0.1 -p 5436 -U kgalli_us --verbose --no-security-labels --no-owner --if-exists --clean --no-tablespaces --no-privileges --disable-dollar-quoting --format=custom --file kgalli-development.dump -d kgalli_db'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
  })

  context('MySQL', () => {
    test
    .env(env)
    .stdout()
    .command(['db:dump', 'api-mysql', '-t', 'kgalli-development.dump', '--dry-run'])
    .it('invokes docker cmd to dump database', ctx => {
      const expectedOutput = 'docker run --rm -t --net=host -v $PWD:/opt -w /opt mysql mysqldump -h 127.0.0.1 -P 3306 -u kgalli_us -pkgalli_pw kgalli_db > kgalli-development.dump'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
  })
})
