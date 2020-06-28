import {isEmpty} from 'lodash'

function stdOutHelperForDockerComposeCmd(project: string, workDir: string) {
  function dockerComposeCmd(cmd: string, environment: string, options: string[]): string {
    const projectOption = `-p ${project}_${environment}`
    const dcConfigFileOption = `-f ${workDir}/docker-compose.${project}.${environment}.yaml`
    let dcCommand = `docker-compose ${projectOption} ${dcConfigFileOption} ${cmd}`

    if (isEmpty(options) === false) {
      dcCommand += ` ${options.join(' ')}`
    }

    return `${dcCommand}`
  }

  function stdOutForDockerComposeCmd(cmd: string, environment: string, options: string[]): string {
    const upNotStartFlag = ['--no-start', options[0]]

    switch (cmd) {
    case 'start':
      return dockerComposeCmd('up', environment, ['--detach --build --remove-orphans', ...options])
    case 'restart':
      return `${dockerComposeCmd('stop', environment, options)}\n${dockerComposeCmd('up', environment, upNotStartFlag)}\n${dockerComposeCmd('start', environment, options)}`
    case 'status':
      return dockerComposeCmd('ps --all', environment, options)
    default:
      return dockerComposeCmd(cmd, environment, options)
    }
  }

  return stdOutForDockerComposeCmd
}

export {stdOutHelperForDockerComposeCmd}
