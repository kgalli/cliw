import {expect, test} from '@oclif/test'

describe('pull', () => {
  test
    .stdout()
    .command(['pull', '--service', 'api'])
    .it('runs pull --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose pull api')
    })
})
