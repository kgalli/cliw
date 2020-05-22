import {expect} from 'chai'

import ConfigHelper from '../../../src/wrapper/service/docker-compose/config-helper'

const project = 'demot-test'
const environment = 'testenv'
const configFileLocation = '/absolute-path/docker-compose.yaml'

describe.only('DockerComposeWrapper', () => {
  let subject: ConfigHelper

  before(() => {
    subject = new ConfigHelper(project, '', configFileLocation)
  })

  describe('.writeDockerComposeConfig', () => {
    context('', () => {
      it('default', () => {
        const services = []
        const environment = ''

        expect(subject.writeDockerComposeConfig(services, environment))
          .to.eql(expectedDockerComposeCmd(expectedSubCmd))
      })
    })
  })
})
