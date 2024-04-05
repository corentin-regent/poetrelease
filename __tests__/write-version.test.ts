import { readFileSync } from 'fs'
import writeVersion from '../src/actions/write-version'
import { inputFile, test } from './helpers'

function expectedFile(path: string, extension: string) {
  return `${path}/expected${extension}`
}

function assertWorks(path: string, extension: string) {
  const modifiedChangelog = readFileSync(inputFile(path, extension)).toString()
  const expectedOutput = readFileSync(expectedFile(path, extension)).toString()
  expect(modifiedChangelog).toEqual(expectedOutput)
}

const mockedInputs = () => ({ version: '1.0.0' })

test(writeVersion, expectedFile, assertWorks, mockedInputs, false)
