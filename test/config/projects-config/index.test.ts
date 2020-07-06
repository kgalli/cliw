import {expect} from '@oclif/test'

import ProjectsConfigRepo from '../../../src/config/projects-config'
import {ProjectsConfig} from '../../../src/types/projects-config'
import {loadYamlConfig, removeConfigFile, TEST_CONFIG_DIR_PATH, TEST_WORK_DIR_PATH} from '../../helper/test-helper'

describe('ProjectsConfigRepo', () => {
  const projectsConfigFileName = 'projects-config.yaml'
  let subject: ProjectsConfigRepo

  function loadProjectsConfig(): ProjectsConfig {
    return loadYamlConfig<ProjectsConfig>(TEST_CONFIG_DIR_PATH, projectsConfigFileName)
  }

  context('when project config does not exist', () => {
    context('.initialize', () => {
      beforeEach(() => {
        subject = new ProjectsConfigRepo(TEST_CONFIG_DIR_PATH, projectsConfigFileName)
      })

      afterEach(() => removeConfigFile(TEST_CONFIG_DIR_PATH, projectsConfigFileName))

      it('initializes projects config file when called with valid parameters', () => {
        const project = 'test'
        const workDir = TEST_WORK_DIR_PATH
        const configDir = TEST_CONFIG_DIR_PATH
        const expectedProjectsConfig = {
          default: project,
          projects: [{
            name: project,
            workDir,
            configDir,
          }],
        }

        expect(subject.initialize(project, workDir, configDir)).to.eql(expectedProjectsConfig)
        expect(loadProjectsConfig()).to.eql(expectedProjectsConfig)
      })

      it('throws validation error when called with non-existing workDir', () => {
        const project = 'test'
        const workDir = 'not-existing'
        const configDir = TEST_CONFIG_DIR_PATH
        const expectedErrorMessage = 'Working directory \'not-existing\' could not be found'

        expect(() => subject.initialize(project, workDir, configDir)).to.throw(expectedErrorMessage)
      })

      it('throws validation error when called with non-existing mainConfigLocation', () => {
        const project = 'test'
        const workDir = TEST_WORK_DIR_PATH
        const configDir = 'non-existing'
        const expectedErrorMessage = 'Configuration directory \'non-existing\' could not be found'

        expect(() => subject.initialize(project, workDir, configDir)).to.throw(expectedErrorMessage)
      })
    })
  })

  context('when projects config exists', () => {
    beforeEach(() => {
      const project = 'test'
      const workDir = TEST_WORK_DIR_PATH
      const configDir = TEST_CONFIG_DIR_PATH

      subject = new ProjectsConfigRepo(TEST_CONFIG_DIR_PATH, projectsConfigFileName)
      subject.initialize(project, workDir, configDir)
    })

    afterEach(() => {
      removeConfigFile(TEST_CONFIG_DIR_PATH, projectsConfigFileName)
    })

    context('.addProject', () => {
      it('adds project to the project lists when called with valid parameters', () => {
        // const project = 'test'
        // const workDir = TEST_WORK_DIR_PATH
        // const configDir = TEST_CONFIG_DIR_PATH

        // TODO FIXME
        // expect(subject.addProject(project, workDir, configDir)).to.eql(expectedProjectsConfig)
      })

      it('throws validation error when called with non-existing workDir', () => {
        const project = 'test'
        const workDir = 'not-existing'
        const configDir = TEST_CONFIG_DIR_PATH
        const expectedErrorMessage = 'Working directory \'not-existing\' could not be found'

        expect(() => subject.addProject(project, workDir, configDir)).to.throw(expectedErrorMessage)
      })

      it('throws validation error when called with non-existing configDir', () => {
        const project = 'test'
        const workDir = TEST_WORK_DIR_PATH
        const configDir = 'non-existing'
        const expectedErrorMessage = 'Configuration directory \'non-existing\' could not be found'

        expect(() => subject.addProject(project, workDir, configDir)).to.throw(expectedErrorMessage)
      })
    })

    context('.removeProject', () => {
      it('throws validation error when called with default project', () => {
        const project = 'test'

        expect(() => subject.removeProject(project))
        .to
        .throw('Project is the only one defined and therefore can not be removed')
      })
    })

    context('.setDefaultProject', () => {
      it('setDefaultProject from the project lists when called with valid parameters', () => {
        // const project = 'test'

        // TODO FIXME
        // expect(subject.setDefaultProject(project)).to.eql(expectedProjectsConfig)
      })

      it('throws validation error when called with non-existing project', () => {
        const project = 'non-existing'
        const expectedErrorMessage = 'Project with name non-existing could not be found'

        expect(() => subject.setDefaultProject(project)).to.throw(expectedErrorMessage)
      })
    })
  })
})
