//import {writeFileSync} from 'fs'
import {isEmpty} from 'lodash'

export default class DockerComposeConfig {
  workDir: string
  servicesConfig: any
  projectName: string
  networkName: string

  constructor(servicesConfig: any, workDir: string, projectName: string, networkName: string) {
    this.servicesConfig = servicesConfig
    this.workDir = workDir
    this.projectName = projectName
    this.networkName = networkName
  }

  write(filePath: string environment: string) {
    //writeFileSync('./docker-compose.yaml', dockerComposeYaml)
  }
}
