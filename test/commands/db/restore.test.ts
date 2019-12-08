import {expect, test} from '@oclif/test'

import {env, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('db:restore', () => {
  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['db:restore', 'api', '-r', 'kgalli-development.dump', '--dry-run'])
    .it('invokes docker command to restore database', ctx => {
      const expectedOutput = 'docker run --rm -t --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres pg_restore -h 127.0.0.1 -p 5436 -U kgalli_us --verbose --no-owner --no-privileges --format=custom -d kgalli_db kgalli-development.dump'

      expect(ctx.stdout).to.contain(expectedOutput)
    })

  test
    .env(env)
    .stdout()
    .do(() => writeProjectsConfigDefault())
    .command(['db:restore', 'api', '--environment', 'production', '-r', 'kgalli-development.dump', '--dry-run'])
    .catch(err => expect(err.message).to.match(/Command "restore" is not supported in a readonly connection/))
    .it('raises an error due to readonly data source')
})
