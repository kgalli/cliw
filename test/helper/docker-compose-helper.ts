import {isEmpty} from 'lodash'

function stdOutHelperForDockerComposeCmd(projectName: string, workDir: string) {
  function dockerComposeCmd(cmd: string, environment: string, options: string[]): string {
    const projectFlag = `-p ${projectName}`
    const dcConfigFileFlag = `-f ${workDir}/docker-compose.${environment}.yaml`
    let result = `docker-compose ${projectFlag} ${dcConfigFileFlag} ${cmd}`

    if (isEmpty(options) === false) {
      result += ` ${options.join(' ')}`
    }

    return `${result} `
  }

  function stdOutForDockerComposeCmd(cmd: string, environment: string, options: string[]): string {
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

  return stdOutForDockerComposeCmd
}

export {stdOutHelperForDockerComposeCmd}
