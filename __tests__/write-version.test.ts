import { cpSync, readFileSync, rmSync } from 'fs'
import * as core from '@actions/core'
import writeVersion from '../src/actions/write-version'
import { inputFile, iterResourceDir, resourceDir, supportedExtensions } from './helpers'

const getInputMock = jest.spyOn(core, 'getInput')
const setFailedMock = jest.spyOn(core, 'setFailed')

function mockInputs(path: string, extension: string) {
  getInputMock.mockImplementation(inputName => {
    if (inputName === 'changelog') {
      return inputFile(path, extension)
    } else if (inputName === 'version') {
      return '1.0.0'
    }
    fail(`Queried invalid input: ${inputName}`)
  })
}

function readInputFile(path: string, extension: string) {
  return readFileSync(inputFile(path, extension)).toString()
}

function expectedOutput(path: string, extension: string) {
  return readFileSync(`${path}/expected${extension}`).toString()
}

describe('writeVersion', () => {
  const tmpDir = '.test-valid-writeVersion'
  beforeAll(() => cpSync(resourceDir('valid'), tmpDir, { recursive: true }))

  iterResourceDir('valid').forEach(scenario => {
    describe(scenario.name, () => {
      const path = `${scenario.path}/${scenario.name}`
      supportedExtensions(path).forEach(extension => {
        it(`should be able to write new version for ${extension} files`, async () => {
          mockInputs(path, extension)
          await writeVersion()
          expect(readInputFile(path, extension)).toEqual(expectedOutput(path, extension))
          expect(setFailedMock).not.toHaveBeenCalled()
        })
      })
    })
  })

  afterAll(() => {
    cpSync(tmpDir, resourceDir('valid'), { recursive: true })
    rmSync(tmpDir, { recursive: true })
  })
})
