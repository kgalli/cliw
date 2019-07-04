export default interface ProjectConfig {
  name: string
  mainConfigLocation: string,
  defaultRunTypeFlag: RunTypeFlag
  servicesRunType: ServicesRunType
}

export interface ServicesRunType {
  [key: string]: RunTypeFlag
}

export const enum RunTypeFlag {
  IMAGE = 'image', SRC = 'src'
}
