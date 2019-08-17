import {writeFileSync} from 'fs'

import {BuildOrigin} from '../../src/config/project-config'
import ProjectsConfig from '../../src/config/projects-config'

export function writeProjectsConfig(projectsConfigLocation: string, mainConfigLocation: string) {
  writeFileSync(projectsConfigLocation, JSON.stringify({
    default: 'test',
    projects: [
      {
        name: 'test',
        mainConfigLocation,
        defaultBuildOrigin: BuildOrigin.REGISTRY,
        servicesBuildOrigin: {
          api: BuildOrigin.REGISTRY,
          web: BuildOrigin.REGISTRY
        }
      }
    ]
  } as ProjectsConfig))
}
