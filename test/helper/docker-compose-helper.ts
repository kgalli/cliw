import {isEmpty} from 'lodash'

function stdOutHelperForDockerComposeCmd(projectName: string, workDir: string) {
  function dockerComposeCmd(cmd: string, environment: string, options: string[]): string {
    const projectFlag = `-p ${projectName}`
    const dcConfigFileFlag = `-f ${workDir}/docker-compose.${environment}.yaml`
    let result = `docker-compose ${projectFlag}_${environment} ${dcConfigFileFlag} ${cmd}`

    if (isEmpty(options) === false) {
      result += ` ${options.join(' ')}`
    }

    return `${result} `
  }

  function stdOutForDockerComposeCmd(cmd: string, environment: string, options: string[]): string {
    const upNotStartFlag = ['--no-start', options[0]]

    switch (cmd) {
    case 'start':
      return `${dockerComposeCmd('up', environment, upNotStartFlag)}\n${dockerComposeCmd(cmd, environment, options)}`
    case 'restart':
      return `${dockerComposeCmd('stop', environment, options)}\n${dockerComposeCmd('up', environment, upNotStartFlag)}\n${dockerComposeCmd('start', environment, options)}`
    case 'status':
      return dockerComposeCmd('ps', environment, options)
    default:
      return dockerComposeCmd(cmd, environment, options)
    }
  }

  return stdOutForDockerComposeCmd
}

export {stdOutHelperForDockerComposeCmd}
