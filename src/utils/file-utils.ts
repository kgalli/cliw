import {existsSync, mkdirSync} from 'fs'

export function exists(fileLocation: string): boolean {
  return existsSync(fileLocation)
}

export function mkdir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true, mode: 0o755})
  }
}
