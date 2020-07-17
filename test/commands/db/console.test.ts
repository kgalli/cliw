import {expect, test} from '@oclif/test'

import {env, removeProjectsConfigDefault, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('db:console', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  context('PostgreSQL', () => {
    const expectedDockerCmdPrefix = 'docker run --rm -i -t --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres'
    const expectedDockerCmdPrefixNoInteractiveNoTty = 'docker run --rm --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres'
    const expectedCmdAndCredentials = 'psql -h 127.0.0.1 -p 5436 -U kgalli_us'

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '--dry-run'])
    .it('invokes docker cmd to open a console', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} ${expectedCmdAndCredentials} -d kgalli_db`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-c', '"SELECT * FROM users LIMIT 1;"', '--dry-run'])
    .it('invokes docker cmd to run given command', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefixNoInteractiveNoTty} ${expectedCmdAndCredentials} -d kgalli_db -c "SELECT * FROM users LIMIT 1;"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-f', '"db/inserts.sql"', '--dry-run'])
    .it('invokes docker cmd to run commands given by file', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefixNoInteractiveNoTty} ${expectedCmdAndCredentials} -d kgalli_db -f "db/inserts.sql"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-c', 'SELECT * FROM users LIMIT 1;', '-f', 'db/inserts.sql', '--dry-run'])
    .catch(error => expect(error.message).to.eql('--file= cannot also be provided when using --command='))
    .it('does not allow to use --command option together with --file option')
  })

  context('MySQL', () => {
    const expectedDockerCmdPrefix = 'docker run --rm -i -t --net=host -v $PWD:/opt -w /opt mysql'
    const expectedDockerCmdPrefixNoTty = 'docker run --rm -i --net=host -v $PWD:/opt -w /opt mysql'
    const expectedCmdAndCredentials = 'mysql -h 127.0.0.1 -P 3306 -u kgalli_us -pkgalli_pw'

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api-mysql', '--dry-run'])
    .it('invokes docker cmd to open a console', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} ${expectedCmdAndCredentials} -D kgalli_db`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api-mysql', '-c', '"SELECT * FROM users LIMIT 1;"', '--dry-run'])
    .it('invokes docker cmd to run given command', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefixNoTty} ${expectedCmdAndCredentials} -D kgalli_db -e "SELECT * FROM users LIMIT 1;"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api-mysql', '-f', '"db/inserts.sql"', '--dry-run'])
    .it('invokes docker cmd to run commands given by file', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefixNoTty} ${expectedCmdAndCredentials} -D kgalli_db < "db/inserts.sql"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:console', 'api-mysql', '-c', 'SELECT * FROM users LIMIT 1;', '-f', 'db/inserts.sql', '--dry-run'])
    .catch(error => expect(error.message).to.eql('--file= cannot also be provided when using --command='))
    .it('does not allow to use --command option together with --file option')
  })
})
