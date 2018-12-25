import {expect, test} from '@oclif/test'

describe('up', () => {
  test
    .stdout()
    .command(['up', '--service', 'api'])
    .it('runs up --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose up api')
    })
})
