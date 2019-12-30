import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
import {safeLoad} from 'js-yaml'

function exists(fileLocation: string): boolean {
  return existsSync(fileLocation)
}

function load(fileLocation: string, configName: string): any {
  if (existsSync(fileLocation)) {
    if (fileLocation.endsWith('yaml') || fileLocation.endsWith('yml')) {
      return safeLoad(readFileSync(fileLocation, 'utf8'))
    }

    return JSON.parse(readFileSync(fileLocation, 'utf8').toString())
  }

  throw Error(`${configName} at '${fileLocation}' does not exist`)
}

function writeJson(config: any, fileLocation: string) {
  return writeFileSync(fileLocation, JSON.stringify(config))
}

function remove(fileLocation: string) {
  if (existsSync(fileLocation)) {
    return unlinkSync(fileLocation)
  }

  throw Error(`File '${fileLocation}' to delete does not exist`)
}

export default {
  exists,
  load,
  writeJson,
  remove
}
