import {expect, test} from '@oclif/test'

describe('stop', () => {
  test
    .stdout()
    .command(['stop', '--service', 'api'])
    .it('runs stop --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose stop api')
    })
})
