export interface ProjectsConfig {
  default: string,
  projects: ProjectConfig[]
}

export interface ProjectConfig {
  name: string
  workDir: string
  mainConfigPath: string
}
