import FileUtils from '../file-utils'

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
  projectsConfigLocation: string
  configName: string

  constructor(projectsConfigLocation: string) {
    this.projectsConfigLocation = projectsConfigLocation
    this.configName = 'ProjectsConfig'
  }

  initialize(project: string, workDirLocation: string, mainConfigLocation: string): ProjectsConfig {
    const projectsConfig = {
      default: project,
      projects: [this.constructProjectConfig(project, workDirLocation, mainConfigLocation)]
    } as ProjectsConfig

    this.save(projectsConfig)

    return projectsConfig
  }

  setDefaultProject(project: string): void {
    const projectsConfig = this.load()
    const projects = projectsConfig.projects.map(project => project.name)

    if (!projects.includes(project)) {
      throw new Error(`Project with name ${project} does not exist.`)
    }

    projectsConfig.default = project
    this.save(projectsConfig)
  }

  addProject(project: string, workDirLocation: string, mainConfigLocation: string): ProjectConfig {
    const projectsConfig = this.load()
    const projectConfig = this.constructProjectConfig(project, workDirLocation, mainConfigLocation)

    this.validate(projectConfig)
    projectsConfig.projects.push(projectConfig)
    this.save(projectsConfig)

    return projectConfig
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

    throw new Error(`Project ${project} could not be found in ${this.projectsConfigLocation}`)
  }

  exists() {
    return FileUtils.exists(this.projectsConfigLocation)
  }

  load(): ProjectsConfig {
    return FileUtils.load(this.projectsConfigLocation, this.configName) as ProjectsConfig
  }

  loadDefaultProjectConfig(): ProjectConfig {
    const projectsConfig = this.load()

    return this.extractProjectConfig(projectsConfig, projectsConfig.default)
  }

  delete() {
    return FileUtils.remove(this.projectsConfigLocation)
  }

  private validate(projectConfig: ProjectConfig) {
    if (!FileUtils.exists(projectConfig.mainConfigLocation)) {
      throw new Error(`File at location ${projectConfig.mainConfigLocation} does not exist`)
    }
    if (!FileUtils.exists(projectConfig.workDir)) {
      throw new Error('Working directory could not be found with at the provided location')
    }
  }

  private constructProjectConfig(project: string, workDirLocation: string, mainConfigLocation: string): ProjectConfig {
    return {
      name: project,
      workDir: workDirLocation,
      mainConfigLocation
    } as ProjectConfig
  }

  private save(projectsConfig: ProjectsConfig): void {
    FileUtils.writeJson(projectsConfig, this.projectsConfigLocation)
  }

  private extractProjectConfig(projectsConfig: ProjectsConfig, name: string): ProjectConfig {
    const projectConfig = projectsConfig.projects.find(p => p.name === name)

    if (projectConfig) {
      return projectConfig
    }

    throw new Error(`Project ${name} could not be found in ${this.projectsConfigLocation}`)
  }
}
