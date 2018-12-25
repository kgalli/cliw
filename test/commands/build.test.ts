import {expect, test} from '@oclif/test'

describe('build', () => {
  test
    .stdout()
    .command(['build'])
    .it('docker hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['build', '--service', 'api'])
    .it('runs build --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose build api')
    })
})
