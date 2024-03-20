import { existsSync, readdirSync } from 'fs'
import { handlers } from '../src/handlers'

export function inputFile(path: string, extension: string) {
  return `${path}/input${extension}`
}

export function supportedExtensions(testRootPath: string) {
  return Object.keys(handlers).filter(extension => existsSync(inputFile(testRootPath, extension)))
}

export function resourceDir(dirName: string) {
  return `__tests__/resources/${dirName}`
}

export function iterResourceDir(dirName: string) {
  return readdirSync(resourceDir(dirName), { withFileTypes: true })
}
