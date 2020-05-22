import {expect} from 'chai'
import {createSandbox, SinonSandbox, SinonSpy} from 'sinon'

import SimpleShell from '../../../src/wrapper/shell/simple-shell'

const sandbox: SinonSandbox = createSandbox()

describe('Shell', () => {
  let shellCallbackSpy: SinonSpy
  let loggerSpy: SinonSpy

  beforeEach(() => {
    const shellCallback = (): void => {}
    const logger = (): void => {}

    shellCallbackSpy = sandbox.spy(shellCallback)
    loggerSpy = sandbox.spy(logger)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('.exec', () => {
    context('default', () => {
      it('executes the command', () => {
        const shellOptions = {dryRun: false, logger: loggerSpy}
        const subject = new SimpleShell(shellCallbackSpy, shellOptions)

        subject.run('')

        expect(loggerSpy.callCount).to.eql(0)
        expect(shellCallbackSpy.callCount).to.eql(1)
      })
    })

    context('when dryRun enabled', () => {
      it('prints the command only', () => {
        const shellOptions = {dryRun: true, logger: loggerSpy}
        const subject = new SimpleShell(shellCallbackSpy, shellOptions)

        subject.run('cliw run')

        expect(loggerSpy.callCount).to.eql(1)
        expect(loggerSpy.firstCall.args.join()).to.eql('cliw run')
        expect(shellCallbackSpy.callCount).to.eql(0)
      })
    })
  })
})
