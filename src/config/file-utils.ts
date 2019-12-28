import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
import {safeLoad} from 'js-yaml'

import {ProjectsBuildOriginConfig} from './build-origins-config'
import {MainConfig} from './main-config'
import {ProjectsConfig} from './projects-config'

function exists(fileLocation: string): boolean {
  return existsSync(fileLocation)
}

function load(fileLocation: string, configName: string): MainConfig | ProjectsConfig | ProjectsBuildOriginConfig {
  if (existsSync(fileLocation)) {
    if (fileLocation.endsWith('yaml') || fileLocation.endsWith('yml')) {
      return safeLoad(readFileSync(fileLocation, 'utf8'))
    }

    return JSON.parse(readFileSync(fileLocation, 'utf8').toString())
  }

  throw Error(`${configName} at '${fileLocation}' does not exist`)
}

function writeJson(config: MainConfig | ProjectsConfig | ProjectsBuildOriginConfig, fileLocation: string) {
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
