import {ProjectConfig, ProjectsConfig} from '../../types/projects-config'
import {exists} from '../../utils/file-utils'
import YamlConfigFileRepo from '../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'projects.yaml'

export default class ProjectsConfigRepo extends YamlConfigFileRepo<ProjectsConfig> {
  constructor(configFilePath: string, fileName: string = CONFIG_FILE_NAME) {
    super(configFilePath, fileName)
  }

  initialize(project: string, workDirLocation: string, mainConfigPath: string): ProjectsConfig {
    const projectConfig = this.constructProjectConfig(project, workDirLocation, mainConfigPath)

    this.validate(projectConfig)

    const projectsConfig = {
      default: project,
      projects: [projectConfig]
    } as ProjectsConfig

    this.write(projectsConfig)
    return projectsConfig
  }

  setDefaultProject(project: string): ProjectsConfig {
    const projectsConfig = this.load()
    const projects = projectsConfig.projects.map(project => project.name)

    if (!projects.includes(project)) {
      throw new Error(`Project with name ${project} does not exist.`)
    }

    projectsConfig.default = project

    this.write(projectsConfig)
    return projectsConfig
  }

  addProject(project: string, workDirLocation: string, mainConfigLocation: string): ProjectsConfig {
    const projectsConfig = this.load()
    const projectConfig = this.constructProjectConfig(project, workDirLocation, mainConfigLocation)

    this.validate(projectConfig)
    projectsConfig.projects.push(projectConfig)

    this.write(projectsConfig)
    return projectsConfig
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
        return this.remove()
      } else {
        return this.write(projectsConfig)
      }
    }
  }

  loadDefaultProjectConfig(): ProjectConfig {
    const projectsConfig = this.load()

    return this.extractProjectConfig(projectsConfig, projectsConfig.default)
  }

  private validate(projectConfig: ProjectConfig) {
    if (!exists(projectConfig.mainConfigPath)) {
      throw new Error(`Configuration directory '${projectConfig.mainConfigPath}' does not exist`)
    }
    if (!exists(projectConfig.workDir)) {
      throw new Error(`Working directory '${projectConfig.workDir}' does not exist`)
    }
  }

  private constructProjectConfig(project: string, workDirLocation: string, mainConfigPath: string): ProjectConfig {
    return {
      name: project,
      workDir: workDirLocation,
      mainConfigPath
    } as ProjectConfig
  }

  private extractProjectConfig(projectsConfig: ProjectsConfig, name: string): ProjectConfig {
    const projectConfig = projectsConfig.projects.find(p => p.name === name)

    if (projectConfig) {
      return projectConfig
    }

    throw new Error(`Project ${name} could not be found`)
  }
}
