import {BuildOrigin} from './build-origin-config'

export default interface ProjectConfig {
  name: string
  workDir: string
  mainConfigLocation: string
  defaultBuildOrigin: BuildOrigin
}
