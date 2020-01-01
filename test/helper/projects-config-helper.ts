import {unlinkSync, writeFileSync} from 'fs'

import {ProjectsConfig} from '../../src/config/projects-config'

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
      }
    ]
  } as ProjectsConfig))
}

export function removeProjectsConfig(projectsConfigLocation: string) {
  unlinkSync(projectsConfigLocation)
}
