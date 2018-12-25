import {expect, test} from '@oclif/test'

describe('status', () => {
  test
    .stdout()
    .command(['status', '--service', 'api'])
    .it('runs status --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose ps api')
    })
})
