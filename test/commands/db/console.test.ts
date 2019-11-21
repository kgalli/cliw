import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:console', () => {
  const expectedDockerCmdPrefix = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres'

  test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '--dry-run'])
    .it('invokes docker cmd to open a console', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} psql -h 127.0.0.1 -p 5436 -U kgalli_us -d kgalli_db`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

  test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-c', '"SELECT * FROM users LIMIT 1;"', '--dry-run'])
    .it('invokes docker cmd to run given command', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} psql -h 127.0.0.1 -p 5436 -U kgalli_us -d kgalli_db -c "SELECT * FROM users LIMIT 1;"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })
})
