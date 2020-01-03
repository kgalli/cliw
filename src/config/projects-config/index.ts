import FileRepository from '../file-repository'

export interface ProjectsConfig {
  default: string,
  projects: ProjectConfig[]
}

export interface ProjectConfig {
  name: string
  workDir: string
  mainConfigLocation: string
}

export default class ProjectsConfigHelper {
  fileRepository: FileRepository

  constructor(fileRepository: FileRepository) {
    this.fileRepository = fileRepository
  }

  initialize(project: string, workDirLocation: string, mainConfigLocation: string): ProjectsConfig {
    const projectConfig = this.constructProjectConfig(project, workDirLocation, mainConfigLocation)

    this.validate(projectConfig)

    const projectsConfig = {
      default: project,
      projects: [projectConfig]
    } as ProjectsConfig

    return this.save(projectsConfig)
  }

  setDefaultProject(project: string): ProjectsConfig {
    const projectsConfig = this.load()
    const projects = projectsConfig.projects.map(project => project.name)

    if (!projects.includes(project)) {
      throw new Error(`Project with name ${project} does not exist.`)
    }

    projectsConfig.default = project

    return this.save(projectsConfig)
  }

  addProject(project: string, workDirLocation: string, mainConfigLocation: string): ProjectsConfig {
    const projectsConfig = this.load()
    const projectConfig = this.constructProjectConfig(project, workDirLocation, mainConfigLocation)

    this.validate(projectConfig)
    projectsConfig.projects.push(projectConfig)

    return this.save(projectsConfig)
  }

  removeProject(project: string) {
    const projectsConfig = this.load()

    if (project === projectsConfig.default && projectsConfig.projects.length > 1) {
      throw new Error('Project is currently defined as default. Please set another default and try again.')
    }

    const projectIndex = projectsConfig.projects.findIndex(p => p.name === project)

    if (projectIndex !== -1) {
      projectsConfig.projects.splice(projectIndex, 1)

      if (projectsConfig.projects.length === 0) {
        return this.delete()
      } else {
        return this.save(projectsConfig)
      }
    }

    throw new Error(`Project ${project} could not be found in ${this.fileRepository.fileLocation}`)
  }

  exists() {
    return this.fileRepository.exists()
  }

  load(): ProjectsConfig {
    return this.fileRepository.load() as ProjectsConfig
  }

  loadDefaultProjectConfig(): ProjectConfig {
    const projectsConfig = this.load()

    return this.extractProjectConfig(projectsConfig, projectsConfig.default)
  }

  delete() {
    this.fileRepository.remove()
  }

  private validate(projectConfig: ProjectConfig) {
    if (!FileRepository.exists(projectConfig.mainConfigLocation)) {
      throw new Error(`Configuration file '${projectConfig.mainConfigLocation}' could not be found`)
    }
    if (!FileRepository.exists(projectConfig.workDir)) {
      throw new Error(`Working directory '${projectConfig.workDir}' does not exist`)
    }
  }

  private constructProjectConfig(project: string, workDirLocation: string, mainConfigLocation: string): ProjectConfig {
    return {
      name: project,
      workDir: workDirLocation,
      mainConfigLocation
    } as ProjectConfig
  }

  private save(projectsConfig: ProjectsConfig): ProjectsConfig {
    this.fileRepository.writeJson(projectsConfig)

    return projectsConfig
  }

  private extractProjectConfig(projectsConfig: ProjectsConfig, name: string): ProjectConfig {
    const projectConfig = projectsConfig.projects.find(p => p.name === name)

    if (projectConfig) {
      return projectConfig
    }

    throw new Error(`Project ${name} could not be found in ${this.fileRepository.fileLocation}`)
  }
}
