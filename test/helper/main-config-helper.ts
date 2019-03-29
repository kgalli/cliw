import {readFileSync} from 'fs'

export function loadMainConfig(mainConfigLocation: string) {
  return JSON.parse(readFileSync(mainConfigLocation).toString())
}
