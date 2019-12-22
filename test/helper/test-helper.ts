import {MainConfig} from '../../src/config/main-config'

import {writeBuildOriginsConfig} from './build-origins-config-helper'
import {stdOutHelperForDockerComposeCmd} from './docker-compose-helper'
import {loadMainConfig} from './main-config-helper'
import {writeProjectsConfig} from './projects-config-helper'

const TEST_PROJECTS_CONFIG_LOCATION = `${__dirname}/../config/test-projects-config.json`
const TEST_BUILD_ORIGINS_CONFIG_LOCATION = `${__dirname}/../config/test-build-origins-config.json`
const TEST_MAIN_CONFIG_LOCATION = `${__dirname}/../config/test-main-config.json`
const TEST_WORK_DIR_LOCATION = '/tmp'
const TEST_DEFAULT_PROJECT_NAME = 'test'

// set TEST_OUTPUT: '1' to see console.log statements in tests
const env = {
  CLIW_PROJECT_CONFIG_LOCATION: TEST_PROJECTS_CONFIG_LOCATION,
  CLIW_BUILD_ORIGINS_CONFIG_LOCATION: TEST_BUILD_ORIGINS_CONFIG_LOCATION,
  TEST_OUTPUT: '0'}

const mainConfig: MainConfig = loadMainConfig(TEST_MAIN_CONFIG_LOCATION)
const expectedStdOutForCmd = stdOutHelperForDockerComposeCmd(TEST_DEFAULT_PROJECT_NAME, TEST_WORK_DIR_LOCATION)

function writeProjectsConfigDefault() {
  writeProjectsConfig(
    TEST_PROJECTS_CONFIG_LOCATION, TEST_MAIN_CONFIG_LOCATION, TEST_DEFAULT_PROJECT_NAME, TEST_WORK_DIR_LOCATION
  )
}

function writeBuildOriginsConfigDefault() {
  writeBuildOriginsConfig(TEST_BUILD_ORIGINS_CONFIG_LOCATION, TEST_DEFAULT_PROJECT_NAME)
}

function writeProjectsAndBuildOriginsConfig() {
  writeProjectsConfigDefault()
  writeBuildOriginsConfigDefault()
}

export {
  mainConfig,
  expectedStdOutForCmd,
  env,
  writeProjectsAndBuildOriginsConfig,
  TEST_DEFAULT_PROJECT_NAME,
  TEST_PROJECTS_CONFIG_LOCATION,
  TEST_BUILD_ORIGINS_CONFIG_LOCATION,
  TEST_MAIN_CONFIG_LOCATION,
  TEST_WORK_DIR_LOCATION
}
