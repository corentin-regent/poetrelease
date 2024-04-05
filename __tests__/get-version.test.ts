import { readFileSync } from 'fs'
import getVersion from '../src/actions/get-version'
import { test } from './helpers'

function expectedFile(path: string) {
  return `${path}/expected-version.txt`
}

function assertWorks(
  path: string,
  _: any,
  setOutputMock: jest.SpiedFunction<(name: string, value: string) => void>
) {
  const expectedVersion = readFileSync(expectedFile(path)).toString()
  expect(setOutputMock).toHaveBeenCalledWith('version', expectedVersion)
}

test(getVersion, expectedFile, assertWorks)
