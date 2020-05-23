import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
import {safeDump, safeLoad} from 'js-yaml'
import {join} from 'path'

import {toCamelCase, toSnakeCase} from './object-key-utils'

export default class YamlConfigFileRepo<T> {
  configFilePath: string
  configFileName: string
  keysToSkipForCaseTransformation: Set<string>

  constructor(configFilePath: string, configName: string, keysToSkipForCaseTransformation: Set<string> = new Set<string>()) {
    this.configFilePath = configFilePath
    this.configFileName = configName
    this.keysToSkipForCaseTransformation = keysToSkipForCaseTransformation
  }

  load(): T {
    if (this.exists()) {
      const yamlObject = safeLoad(readFileSync(this.configFileLocation(), 'utf8'))

      return toCamelCase(yamlObject, this.keysToSkipForCaseTransformation)
    }

    throw Error(`${this.configFileName} at '${this.configFilePath}' does not exist`)
  }

  remove() {
    if (this.exists()) {
      return this.delete()
    }

    throw Error(`File '${this.configFileLocation()}' to delete does not exist`)
  }

  write(data: T): void {
    const dataWithSnakeCaseKeys = toSnakeCase(data, this.keysToSkipForCaseTransformation)
    const yamlObject = safeDump(dataWithSnakeCaseKeys)

    return writeFileSync(this.configFileLocation(), yamlObject, 'utf8')
  }

  exists(): boolean {
    return existsSync(join(this.configFileLocation()))
  }

  private delete(): void {
    return unlinkSync(this.configFileLocation())
  }

  private configFileLocation() {
    return join(this.configFilePath, this.configFileName)
  }
}
