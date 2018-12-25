import {expect, test} from '@oclif/test'

describe('logs', () => {
  test
    .stdout()
    .command(['logs', '--service', 'api'])
    .it('runs logs --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose logs api')
    })
})
