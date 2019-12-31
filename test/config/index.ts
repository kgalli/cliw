import {expect} from '@oclif/test'
import {projectsConfigAddProject} from '../../src/config'

describe('Configuration', () => {
  context('Add project', () => {
    it('add projects to the project lists', () => {
      expect(projectsConfigAddProject())
    })
  })
})
