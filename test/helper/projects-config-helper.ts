import {writeFileSync} from 'fs'

import {BuildOrigin} from '../../src/config/project-config'
import ProjectsConfig from '../../src/config/projects-config'

export function writeProjectsConfig(projectsConfigLocation: string,
                                    mainConfigLocation: string,
                                    projectName: string,
                                    workDir: string) {
  writeFileSync(projectsConfigLocation, JSON.stringify({
    default: projectName,
    projects: [
      {
        name: projectName,
        workDir,
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
