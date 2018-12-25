import {expect, test} from '@oclif/test'

describe('run', () => {
  test
    .stdout()
    .command(['run', 'bin/bash', '--service', 'api'])
    .it('runs run "bin/bash" --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose run api bin/bash')
    })
})
