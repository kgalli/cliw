export default interface ProjectConfig {
  name: string
  mainConfigLocation: string,
  runTypes: RunType[]
}

interface RunType {
  [key: string]: string
}
