import {readFileSync} from 'fs'
import {isEmpty} from 'lodash'

import {MainConfig} from '../src/config/main-config'

const TEST_MAIN_CONFIG_LOCATION = `${__dirname}/config/test-main-config.json`
const mainConfig: MainConfig = JSON.parse(readFileSync(TEST_MAIN_CONFIG_LOCATION).toString())
// set TEST_OUTPUT: '1' to see console.log statements in tests
const env = {ORCHESTRATOR_MAIN_CONFIG_LOCATION: TEST_MAIN_CONFIG_LOCATION, TEST_OUTPUT: '0'}

function dockerComposeCmd(cmd: string, environment: string, options: string[]): string {
  const projectFlag = `-p ${mainConfig.projectName}`
  const dcConfigFileFlag = `-f ${mainConfig.workDir}/docker-compose.${environment}.yaml`
  let result = `docker-compose ${projectFlag} ${dcConfigFileFlag} ${cmd}`

  if (isEmpty(options) === false) {
    result += ` ${options.join(' ')}`
  }

  return `${result} `
}

function expectedStdOutForCmd(cmd: string, environment: string, options: string[]): string {
  switch (cmd) {
  case 'start':
    const upNoStart = ['--no-start', options[0]]
    const stdout = `${dockerComposeCmd('up', environment, upNoStart)}\n${dockerComposeCmd(cmd, environment, options)}`
    return stdout
  case 'status':
    return dockerComposeCmd('ps', environment, options)
  default:
    return dockerComposeCmd(cmd, environment, options)
  }
}

export {mainConfig, expectedStdOutForCmd, env}
