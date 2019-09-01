import {expect, test} from '@oclif/test'

import {writeProjectsConfig} from '../helper/projects-config-helper'

const TEST_PROJECTS_CONFIG_LOCATION = `${__dirname}/../config/test-projects-config.json`
const TEST_MAIN_CONFIG_LOCATION = `${__dirname}/../config/test-main-config.json`
const env = {CLIW_PROJECT_CONFIG_LOCATION: TEST_PROJECTS_CONFIG_LOCATION, TEST_OUTPUT: '0'}

describe('project', () => {
  context('project:list', () => {
    test
      .env(env)
      .stdout()
      .do(() => writeProjectsConfig(TEST_PROJECTS_CONFIG_LOCATION, TEST_MAIN_CONFIG_LOCATION))
      .command(['project:list', '--csv'])
      .it('lists projects', ctx => {
        const csvOutput = ctx.stdout.split('\n')
        // header
        const header = csvOutput[0]
        expect(header).to.contain('Name,Mainconfiglocation,Default')
        // project column
        const firstProject = csvOutput[1].split(',')[0]
        expect(firstProject).to.eql('test')
        // main config location column
        const firstMainConfigLocation = csvOutput[1].split(',')[1]
        expect(firstMainConfigLocation).to.eql(TEST_MAIN_CONFIG_LOCATION)
        // default project column
        const firstProjectDefault = csvOutput[1].split(',')[2]
        expect(firstProjectDefault).to.eql('true')
        // only one project in list
        expect(csvOutput.length).to.eql(3)
      })
  })

  context('project:add', () => {
    test
      .env(env)
      .stdout()
      .do(() => writeProjectsConfig(TEST_PROJECTS_CONFIG_LOCATION, TEST_MAIN_CONFIG_LOCATION))
      .command(['project:add', 'project1', '-c', TEST_MAIN_CONFIG_LOCATION])
      .command(['project:list', '--csv'])
      .it('adds the project', ctx => {
        const csvOutput = ctx.stdout.split('\n')
        // project column
        const firstProject = csvOutput[1].split(',')[0]
        const secondProject = csvOutput[2].split(',')[0]
        expect(firstProject).to.eql('project1')
        expect(secondProject).to.eql('test')
        // main config location column
        const firstMainConfigLocation = csvOutput[1].split(',')[1]
        const secondMainConfigLocation = csvOutput[2].split(',')[1]
        expect(firstMainConfigLocation).to.eql(TEST_MAIN_CONFIG_LOCATION)
        expect(secondMainConfigLocation).to.eql(TEST_MAIN_CONFIG_LOCATION)
        // default project column
        const firstProjectDefault = csvOutput[1].split(',')[2]
        const secondProjectDefault = csvOutput[2].split(',')[2]
        expect(firstProjectDefault).to.eql('')
        expect(secondProjectDefault).to.eql('true')
        // two projects in list
        expect(csvOutput.length).to.eql(4)
      })
  })

  context('project:remove', () => {
    test
      .env(env)
      .stdout()
      .do(() => writeProjectsConfig(TEST_PROJECTS_CONFIG_LOCATION, TEST_MAIN_CONFIG_LOCATION))
      .command(['project:add', 'project1', '-c', TEST_MAIN_CONFIG_LOCATION])
      .command(['project:remove', 'project1'])
      .command(['project:list', '--csv'])
      .it('removes the project', ctx => {
        const csvOutput = ctx.stdout.split('\n')
        // project column
        const firstProject = csvOutput[1].split(',')[0]
        expect(firstProject).to.eql('test')
        // main config location column
        const firstMainConfigLocation = csvOutput[1].split(',')[1]
        expect(firstMainConfigLocation).to.eql(TEST_MAIN_CONFIG_LOCATION)
        // default project column
        const firstProjectDefault = csvOutput[1].split(',')[2]
        expect(firstProjectDefault).to.eql('true')
        // only one project in list
        expect(csvOutput.length).to.eql(3)
      })
  })

  context('project:set-default', () => {
    test
      .env(env)
      .stdout()
      .do(() => writeProjectsConfig(TEST_PROJECTS_CONFIG_LOCATION, TEST_MAIN_CONFIG_LOCATION))
      .command(['project:add', 'project1', '-c', TEST_MAIN_CONFIG_LOCATION])
      .command(['project:set-default', 'project1'])
      .command(['project:list', '--csv'])
      .it('sets the default project', ctx => {
        const csvOutput = ctx.stdout.split('\n')
        // project column
        const firstProject = csvOutput[1].split(',')[0]
        const secondProject = csvOutput[2].split(',')[0]
        expect(firstProject).to.eql('project1')
        expect(secondProject).to.eql('test')
        // main config location column
        const firstMainConfigLocation = csvOutput[1].split(',')[1]
        const secondMainConfigLocation = csvOutput[2].split(',')[1]
        expect(firstMainConfigLocation).to.eql(TEST_MAIN_CONFIG_LOCATION)
        expect(secondMainConfigLocation).to.eql(TEST_MAIN_CONFIG_LOCATION)
        // default project column
        const firstProjectDefault = csvOutput[1].split(',')[2]
        const secondProjectDefault = csvOutput[2].split(',')[2]
        expect(firstProjectDefault).to.eql('true')
        expect(secondProjectDefault).to.eql('')
        // two projects in list
        expect(csvOutput.length).to.eql(4)
      })
  })
})
