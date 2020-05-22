import {expect} from 'chai'

import ServiceWrapper, {
  ExecOptions, LogOptions, StartOptions, StatusOptions, StopOptions,
} from '../../../src/types'
import DockerComposeWrapper from '../../../src/wrapper/service/docker-compose'

const project = 'demot-test'
const environment = 'testenv'
const configFileLocation = '/absolute-path/docker-compose.yaml'
const expectedDockerComposeCmd = (subCmd: string): string => {
  const cmd = []

  cmd.push('docker-compose')
  cmd.push(`-p ${project}_${environment}`)
  cmd.push(`-f ${configFileLocation}`)
  cmd.push(subCmd)

  return cmd.join(' ')
}

describe.only('DockerComposeWrapper', () => {
  let subject: ServiceWrapper

  before(() => {
    const dockerComposeOptions = {
      project,
      configFileLocation,
    }
    subject = new DockerComposeWrapper(dockerComposeOptions)
  })

  describe('.exec', () => {
    context('', () => {
      it('default', () => {
        const execOptions = { } as ExecOptions
        const service = 'web'
        const cmd = 'psql -h localhost -U test'
        const expectedSubCmd = 'exec web psql -h localhost -U test'

        expect(subject.exec(execOptions, service, environment, cmd))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })

      it('tty disabled', () => {
        const execOptions = {noTty: true}
        const service = 'web'
        const cmd = 'psql -h localhost -U test'
        const expectedSubCmd = 'exec --no-tty web psql -h localhost -U test'

        expect(subject.exec(execOptions, service, environment, cmd))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })

  describe('.log', () => {
    context('', () => {
      it('default', () => {
        const logOptions = { } as LogOptions
        const services = ['web', 'api']
        const expectedSubCmd = 'logs web api'

        expect(subject.log(logOptions, services, environment))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })

  describe('.run', () => {
    context('', () => {
      it('default', () => {
        const execOptions = { } as ExecOptions
        const service = 'web'
        const cmd = 'psql -h localhost -U test'
        const expectedSubCmd = 'run web psql -h localhost -U test'

        expect(subject.run(execOptions, service, environment, cmd))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })
  describe('.start', () => {
    context('', () => {
      it('default', () => {
        const options = { } as StartOptions
        const services = ['web', 'api']
        const expectedSubCmd = 'up --detach --build --remove-orphans --no-build web api'

        expect(subject.start(options, services, environment))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })
  describe('.status', () => {
    context('', () => {
      it('default', () => {
        const options = { } as StatusOptions
        const services = ['web', 'api']
        const expectedSubCmd = 'ps web api'

        expect(subject.status(options, services, environment))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })
  describe('.stop', () => {
    context('', () => {
      it('default', () => {
        const options = { } as StopOptions
        const services = ['web', 'api']
        const expectedSubCmd = 'stop web api'

        expect(subject.stop(options, services, environment))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })
})
