import {writeFileSync} from 'fs'

import {RunTypeFlag} from '../../src/config/project-config'
import ProjectsConfig from '../../src/config/projects-config'

export function writeProjectsConfig(projectsConfigLocation: string, mainConfigLocation: string) {
  writeFileSync(projectsConfigLocation, JSON.stringify({
    default: 'test',
    projects: [{
      name: 'test',
      mainConfigLocation,
      defaultRunTypeFlag: RunTypeFlag.IMAGE,
      servicesRunType: {
        api: RunTypeFlag.IMAGE,
        web: RunTypeFlag.IMAGE
      }
    }]
  } as ProjectsConfig))
}
