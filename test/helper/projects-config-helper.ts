import {writeFileSync} from 'fs'

import ProjectsConfig from '../../src/config/projects-config'

export function writeProjectsConfig(projectsConfigLocation: string, mainConfigLocation: string) {
  writeFileSync(projectsConfigLocation, JSON.stringify({
    default: 'test',
    projects: [{
      name: 'test',
      mainConfigLocation,
      defaultRunTypeFlag: 'IMAGE',
      servicesRunType: {
        api: 'IMAGE',
        web: 'IMAGE'
      }
    }]
  } as ProjectsConfig))
}
