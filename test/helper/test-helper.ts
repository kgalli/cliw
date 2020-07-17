import {existsSync, readFileSync, unlinkSync} from 'fs'
import {safeLoad} from 'js-yaml'
import * as path from 'path'

import ProjectsConfigRepo from '../../src/config/projects-config'
import {toCamelCase} from '../../src/utils/object-key-utils'

import {stdOutHelperForDockerComposeCmd} from './docker-compose-helper'

const TEST_CONFIG_DIR_PATH = path.join(__dirname, '..', 'config-files')

const TEST_TMP_DIR_PATH = '/tmp'
const TEST_WORK_DIR_PATH = TEST_TMP_DIR_PATH
const TEST_DEFAULT_PROJECT_NAME = 'test'
const TEST_PROJECTS_CONFIG_FILE_NAME = 'projects.yaml'

// set TEST_OUTPUT: '1' to see console.log statements in tests
const env = {
  CLIW_CONFIG_PATH: TEST_TMP_DIR_PATH,
  TEST_OUTPUT: '0'}

const expectedStdOutForCmd = stdOutHelperForDockerComposeCmd(TEST_DEFAULT_PROJECT_NAME, TEST_WORK_DIR_PATH)

function writeProjectsConfigDefault() {
  const projectsConfig = new ProjectsConfigRepo(TEST_TMP_DIR_PATH, TEST_PROJECTS_CONFIG_FILE_NAME)

  projectsConfig.initialize(TEST_DEFAULT_PROJECT_NAME, TEST_WORK_DIR_PATH, TEST_CONFIG_DIR_PATH)
}

function removeProjectsConfigDefault() {
  unlinkSync(path.join(TEST_TMP_DIR_PATH, TEST_PROJECTS_CONFIG_FILE_NAME))
}

function loadYamlConfig<T>(configPath: string, configFileName: string): T {
  const fileLocation = path.join(configPath, configFileName)

  return toCamelCase(safeLoad(readFileSync(fileLocation, 'utf8')), new Set<string>()) as T
}

function removeConfigFile(filePath: string, fileName: string): void {
  if (existsSync(path.join(filePath, fileName))) {
    unlinkSync(path.join(filePath, fileName))
  }
}

// eslint-disable-next-line no-console
console.log(`Running tests using '${TEST_CONFIG_DIR_PATH}' as config dir.`)

export {
  env,
  TEST_CONFIG_DIR_PATH,
  TEST_WORK_DIR_PATH,
  writeProjectsConfigDefault,
  removeProjectsConfigDefault,
  loadYamlConfig,
  removeConfigFile,
  expectedStdOutForCmd,
}
