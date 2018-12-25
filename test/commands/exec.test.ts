import {expect, test} from '@oclif/test'

describe('exec', () => {
  test
    .stdout()
    .command(['exec', 'bin/bash', '--service', 'api'])
    .it('runs exec "bin/bash" --service api', ctx => {
      expect(ctx.stdout).to.contain('docker-compose exec api bin/bash')
    })
})
