import {MainConfig} from '../../src/config/main-config'

import {stdOutHelperForDockerComposeCmd} from './docker-compose-helper'
import {loadMainConfig} from './main-config-helper'
import {writeProjectsConfig} from './projects-config-helper'

const TEST_PROJECTS_CONFIG_LOCATION = `${__dirname}/../config/test-projects-config.json`
const TEST_MAIN_CONFIG_LOCATION = `${__dirname}/../config/test-main-config.json`

writeProjectsConfig(TEST_PROJECTS_CONFIG_LOCATION, TEST_MAIN_CONFIG_LOCATION)

// set TEST_OUTPUT: '1' to see console.log statements in tests
const env = {ORCHESTRATOR_PROJECT_CONFIG_LOCATION: TEST_PROJECTS_CONFIG_LOCATION, TEST_OUTPUT: '0'}

const mainConfig: MainConfig = loadMainConfig(TEST_MAIN_CONFIG_LOCATION)
const expectedStdOutForCmd = stdOutHelperForDockerComposeCmd(mainConfig.compose.projectName, mainConfig.compose.workDir)

export {mainConfig, expectedStdOutForCmd, env}
