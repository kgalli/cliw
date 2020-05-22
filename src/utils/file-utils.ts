import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
import {safeLoad, safeDump} from 'js-yaml'
import {join} from 'path'

export function exists(fileLocation: string): boolean {
  return existsSync(fileLocation)
}

export function mkdir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true, mode: 0o755})
  }
}

export function load(fileLocation: string, configName: string): any {
  if (existsSync(fileLocation)) {
    if (fileLocation.endsWith('yaml') || fileLocation.endsWith('yml')) {
      return safeLoad(readFileSync(fileLocation, 'utf8'))
    }

    return JSON.parse(readFileSync(fileLocation, 'utf8').toString())
  }

  throw Error(`${configName} at '${fileLocation}' does not exist`)
}

export function loadWithFallback(fileLocation: string, fallback: any): any {
  if (existsSync(fileLocation)) {
    if (fileLocation.endsWith('yaml') || fileLocation.endsWith('yml')) {
      return safeLoad(readFileSync(fileLocation, 'utf8'))
    }

    return JSON.parse(readFileSync(fileLocation, 'utf8').toString())
  }

  return fallback
}

export function writeJson(config: any, fileLocation: string) {
  return writeFileSync(fileLocation, JSON.stringify(config))
}

export function remove(fileLocation: string) {
  if (existsSync(fileLocation)) {
    return unlinkSync(fileLocation)
  }

  throw Error(`File '${fileLocation}' to delete does not exist`)
}

export function loadYamlFile(filePath: string, fileName: string) {
  const fileLocation = join(filePath, fileName)
  return safeLoad(readFileSync(fileLocation, 'utf8'))
}

export function writeYamlFile(fileLocation: string, data: any): void {
  return writeFileSync(fileLocation, safeDump(data), 'utf8')
}
