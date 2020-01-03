import {expect} from '@oclif/test'
import * as sinon from 'sinon'

import FileRepository from '../../../src/config/file-repository'
import ProjectsConfigHelper, {ProjectsConfig} from '../../../src/config/projects-config'
import {TEST_MAIN_CONFIG_LOCATION, TEST_WORK_DIR_LOCATION} from '../../helper/test-helper'

function fakeProjectsConfig(): ProjectsConfig {
  const projectName = 'demo'

  return {
    default: projectName,
    projects: [
      {
        name: projectName,
        workDir: '/tmp',
        mainConfigLocation: 'fake'
      }
    ]
  }
}

describe('ProjectsConfigHelper', () => {
  let subject: ProjectsConfigHelper
  let projectsConfig: ProjectsConfig
  let fileRepository: FileRepository

  beforeEach('', () => {
    fileRepository = new FileRepository('fakeProjectsFileLocation.json', 'ProjectsConfig')

    const loadStub = sinon.stub(fileRepository, 'load')

    sinon.stub(fileRepository, 'writeJson')
    projectsConfig = fakeProjectsConfig()
    loadStub.returns(projectsConfig)

    subject = new ProjectsConfigHelper(fileRepository)
  })
  context('.initialize', () => {
    it('initializes projects config file when called with valid parameters', () => {
      const project = 'test'
      const workDir = TEST_WORK_DIR_LOCATION
      const mainConfigLocation = TEST_MAIN_CONFIG_LOCATION
      const expectedProjectsConfig = {
        default: project,
        projects: [{
          name: project,
          workDir,
          mainConfigLocation
        }]
      }

      expect(subject.initialize(project, workDir, mainConfigLocation)).to.eql(expectedProjectsConfig)
    })

    it('throws validation error when called with non-existing workDir', () => {
      const project = 'test'
      const workDir = 'not-existing'
      const mainConfigLocation = TEST_MAIN_CONFIG_LOCATION

      projectsConfig.projects.push({name: project, workDir, mainConfigLocation})

      const expectedErrorMessage = 'Working directory \'not-existing\' does not exist'

      expect(() => subject.initialize(project, workDir, mainConfigLocation)).to.throw(expectedErrorMessage)
    })

    it('throws validation error when called with non-existing mainConfigLocation', () => {
      const project = 'test'
      const workDir = TEST_WORK_DIR_LOCATION
      const mainConfigLocation = 'non-existing'

      projectsConfig.projects.push({name: project, workDir, mainConfigLocation})

      const expectedErrorMessage = 'Configuration file \'non-existing\' could not be found'

      expect(() => subject.initialize(project, workDir, mainConfigLocation)).to.throw(expectedErrorMessage)
    })
  })

  context('.addProject', () => {
    it('adds project to the project lists when called with valid parameters', () => {
      const project = 'test'
      const workDir = TEST_WORK_DIR_LOCATION
      const mainConfigLocation = TEST_MAIN_CONFIG_LOCATION
      const expectedProjectsConfig = projectsConfig

      projectsConfig.projects.push({name: project, workDir, mainConfigLocation})

      expect(subject.addProject(project, workDir, mainConfigLocation)).to.eql(expectedProjectsConfig)
    })

    it('throws validation error when called with non-existing workDir', () => {
      const project = 'test'
      const workDir = 'not-existing'
      const mainConfigLocation = TEST_MAIN_CONFIG_LOCATION

      projectsConfig.projects.push({name: project, workDir, mainConfigLocation})

      const expectedErrorMessage = 'Working directory \'not-existing\' does not exist'

      expect(() => subject.addProject(project, workDir, mainConfigLocation)).to.throw(expectedErrorMessage)
    })

    it('throws validation error when called with non-existing mainConfigLocation', () => {
      const project = 'test'
      const workDir = TEST_WORK_DIR_LOCATION
      const mainConfigLocation = 'non-existing'

      projectsConfig.projects.push({name: project, workDir, mainConfigLocation})

      const expectedErrorMessage = 'Configuration file \'non-existing\' could not be found'

      expect(() => subject.addProject(project, workDir, mainConfigLocation)).to.throw(expectedErrorMessage)
    })
  })

  context('.removeProject', () => {
    it('removes project from the project lists when called with valid parameters', () => {
      const project = projectsConfig.default
      const deleteStub = sinon.stub(fileRepository, 'remove')

      expect(subject.removeProject(project)).to.eql(undefined)
      expect(deleteStub.calledOnce).to.eql(true)
    })

    it('throws validation error when called with non-existing project', () => {
      const project = 'non-existing'

      expect(() => subject.removeProject(project))
        .to
        .throw('Project non-existing could not be found in fakeProjectsFileLocation.json')
    })
  })

  context('.setDefaultProject', () => {
    it('setDefaultProject from the project lists when called with valid parameters', () => {
      const project = 'test'
      const workDir = TEST_WORK_DIR_LOCATION
      const mainConfigLocation = TEST_MAIN_CONFIG_LOCATION
      const expectedProjectsConfig = projectsConfig

      projectsConfig.projects.push({name: project, workDir, mainConfigLocation})
      projectsConfig.default = project

      expect(subject.setDefaultProject(project)).to.eql(expectedProjectsConfig)
    })

    it('throws validation error when called with non-existing project', () => {
      const project = 'non-existing'
      const expectedErrorMessage = 'Project with name non-existing does not exist'

      expect(() => subject.setDefaultProject(project)).to.throw(expectedErrorMessage)
    })
  })

  context('.exists', () => {
    it('returns true when config file exists', () => {
      sinon.stub(fileRepository, 'exists').returns(true)

      expect(subject.exists()).to.be.true
    })

    it('returns false when config file does not exists', () => {
      sinon.stub(fileRepository, 'exists').returns(false)

      expect(subject.exists()).to.be.false
    })
  })

  context('.loadDefaultProjectConfig', () => {
    it('loads default project when existing', () => {
      const expectedDefaultProject = fakeProjectsConfig().projects.pop()

      expect(subject.loadDefaultProjectConfig()).to.eql(expectedDefaultProject)
    })
  })
})
