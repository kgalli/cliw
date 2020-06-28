import {expect, test} from '@oclif/test'

import {env, removeProjectsConfigDefault, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('db:create', () => {
  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  context('PostgreSQL', () => {
    const expectedDockerCmdPrefix = 'docker run --rm --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres'

    test
    .env(env)
    .stdout()
    .command(['db:create', 'api', '--dry-run'])
    .it('invokes docker cmd to create database', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} psql -h 127.0.0.1 -p 5436 -U kgalli_us -d template1 -c "CREATE DATABASE kgalli_db WITH OWNER kgalli_us ENCODING 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:create', 'api', '--environment', 'production', '--dry-run'])
    .catch(error => expect(error.message).to.match(/Command "create" is not supported in a readonly connection/))
    .it('raises an error due to readonly data source')
  })

  context('MySQL', () => {
    const expectedDockerCmdPrefix = 'docker run --rm -i --net=host -v $PWD:/opt -w /opt mysql'

    test
    .env(env)
    .stdout()
    .command(['db:create', 'api-mysql', '--dry-run'])
    .it('invokes docker cmd to create database', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} mysql -h 127.0.0.1 -P 3306 -u kgalli_us -pkgalli_pw -D mysql -e "CREATE SCHEMA kgalli_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

    test
    .env(env)
    .stdout()
    .command(['db:create', 'api', '--environment', 'production', '--dry-run'])
    .catch(error => expect(error.message).to.match(/Command "create" is not supported in a readonly connection/))
    .it('raises an error due to readonly data source')
  })
})
