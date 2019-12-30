import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
import {safeLoad} from 'js-yaml'

export default class FileRepository {
  static exists(fileLocation: string): boolean {
    return existsSync(fileLocation)
  }
  fileLocation: string
  configName: string

  constructor(fileLocation: string, configName: string) {
    this.fileLocation = fileLocation
    this.configName = configName
  }

  exists(): boolean {
    return existsSync(this.fileLocation)
  }

  load(): any {
    if (existsSync(this.fileLocation)) {
      if (this.fileLocation.endsWith('yaml') || this.fileLocation.endsWith('yml')) {
        return safeLoad(readFileSync(this.fileLocation, 'utf8'))
      }

      return JSON.parse(readFileSync(this.fileLocation, 'utf8').toString())
    }

    throw Error(`${this.configName} at '${this.fileLocation}' does not exist`)
  }

  writeJson(config: any) {
    writeFileSync(this.fileLocation, JSON.stringify(config))
  }

  remove() {
    if (existsSync(this.fileLocation)) {
      return unlinkSync(this.fileLocation)
    }

    throw Error(`File '${this.fileLocation}' to delete does not exist`)
  }
}
