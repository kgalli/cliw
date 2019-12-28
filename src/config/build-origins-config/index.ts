/*
performance benefits less flexible
{
  projectA: {
    api: { development: "source", test: "registry" },
    web: { development: "registry", test: "registry" }
  }
}
better maintenance even though more complex
[
  {
    project: 'demo',
    services: [
      {
        service: 'api'
        environments: [
          {
            environment: 'development',
            buildOrigin: 'registry'
          }
        ]
      }
    ]
  }
]
*/
import FileUtils from '../file-utils'

export type ProjectsBuildOriginConfig = ProjectBuildOriginConfig[]

export interface ProjectBuildOriginConfig {
  project: string
  services: ServiceBuildOrigin[]
}

export interface ServiceBuildOrigin {
  service: string
  environments: EnvironmentBuildOrigin[]
}

interface EnvironmentBuildOrigin {
  environment: string
  buildOrigin: BuildOrigin
}

export const enum BuildOrigin {
  SOURCE = 'source', REGISTRY = 'registry'
}

export default class ProjectsBuildOriginConfigHelper {
  static extractBuildOrigin(serviceBuildOrigins: ServiceBuildOrigin[], service: string, environment: string) {
    const serviceBuildOrigin = serviceBuildOrigins.find(s => s.service === service)
    const environmentBuildOrigin = serviceBuildOrigin
      ? serviceBuildOrigin.environments.find(e => e.environment === environment)
      : {environment, buildOrigin: BuildOrigin.REGISTRY}

    return environmentBuildOrigin
      ? environmentBuildOrigin.buildOrigin
      : BuildOrigin.REGISTRY
  }
  buildOriginsConfigLocation: string
  configName: string

  constructor(buildOriginsLocation: string) {
    this.buildOriginsConfigLocation = buildOriginsLocation
    this.configName = 'ProjectsBuildOriginConfig'
  }

  initialize(project: string, services: string[], environments: string[]): ProjectsBuildOriginConfig {
    const projectsBuildOriginConfig = [] as ProjectsBuildOriginConfig
    const projectBuildOriginConfig = this.constructProjectBuildOriginConfig(project, services, environments)

    projectsBuildOriginConfig.push(projectBuildOriginConfig)

    return this.save(projectsBuildOriginConfig)
  }

  load(): ProjectsBuildOriginConfig {
    return FileUtils.load(this.buildOriginsConfigLocation, this.configName) as ProjectsBuildOriginConfig
  }

  loadProjectBuildOriginConfig(project: string) {
    const projectsBuildOriginConfig = this.load()
    const projectBuildOriginConfig = projectsBuildOriginConfig.find(p => p.project === project)

    if (projectBuildOriginConfig) {
      return projectBuildOriginConfig
    }

    throw new Error(`Project ${project} could not be found in projects config`)
  }

  addProjectBuildOriginConfig(project: string, services: string[], environments: string[]): ProjectBuildOriginConfig {
    const projectsBuildOriginConfig = this.load()
    const projectBuildOriginConfig = this.constructProjectBuildOriginConfig(project, services, environments)

    projectsBuildOriginConfig.push(projectBuildOriginConfig)
    this.save(projectsBuildOriginConfig)

    return projectBuildOriginConfig
  }

  updateServiceBuildOrigin(project: string, service: string, environment: string, buildOrigin: BuildOrigin) {
    const projectsBuildOriginConfig = this.load()
    const projectBuildOriginConfig = projectsBuildOriginConfig.find(p => p.project === project)

    if (projectBuildOriginConfig) {
      const serviceBuildOrigins = projectBuildOriginConfig.services.find(s => s.service === service)

      if (serviceBuildOrigins) {
        const environmentBuildOrigin = serviceBuildOrigins.environments.find(e => e.buildOrigin === environment)

        if (environmentBuildOrigin) {
          environmentBuildOrigin.buildOrigin = buildOrigin

          this.save(projectsBuildOriginConfig)
        }
      }

      throw new Error('Update of ProjectsBuildOriginConfig failed due to missing project, service or environment data')
    }
  }

  private constructServiceBuildOrigins(services: string[], environments: string[]): ServiceBuildOrigin[] {
    const serviceBuildOrigins = [] as ServiceBuildOrigin[]

    services.forEach(service => {
      serviceBuildOrigins.push({
        service,
        environments: environments.map(environment => ({environment, buildOrigin: BuildOrigin.REGISTRY}))
      })
    })

    return serviceBuildOrigins
  }

  private constructProjectBuildOriginConfig(project: string, services: string[], environments: string[]): ProjectBuildOriginConfig {
    const projectBuildOriginConfig = {} as ProjectBuildOriginConfig

    projectBuildOriginConfig.project = project
    projectBuildOriginConfig.services = this.constructServiceBuildOrigins(services, environments)

    return projectBuildOriginConfig
  }

  private save(projectsBuildOriginConfig: ProjectsBuildOriginConfig): ProjectsBuildOriginConfig {
    FileUtils.writeJson(projectsBuildOriginConfig, this.buildOriginsConfigLocation)

    return projectsBuildOriginConfig
  }
}
