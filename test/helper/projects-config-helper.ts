import {writeFileSync} from 'fs'

export function writeProjectsConfig(projectsConfigLocation: string, mainConfigLocation: string) {
  writeFileSync(projectsConfigLocation, JSON.stringify({
    default: 'test',
    projects: [{
      name: 'test',
      mainConfigLocation,
      ryunTypes: []
    }]
  }))
}
