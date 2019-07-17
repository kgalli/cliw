import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:restore', () => {
  test
    .env(env)
    .stdout()
    .command(['db:restore', '--service', 'api', '-r', 'kgalli-development.dump', '--dry-run'])
    .it('invokes db:restore with a known connection', ctx => {
      const expectedOutput = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres pg_restore -h 127.0.0.1 -p 5436 -U kgalli_us --verbose --no-owner --no-privileges --format=custom -d kgalli_db kgalli-development.dump'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
})
