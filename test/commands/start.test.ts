import {expect, test} from '@oclif/test'

describe('start', () => {
  test
    .stdout()
    .command(['start', '--service', 'api'])
    .it('runs start --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose up --no-start api\ndocker-compose start api')
    })
})
