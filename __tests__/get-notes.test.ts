import { readFileSync } from 'fs'
import * as core from '@actions/core'
import getNotes from '../src/actions/get-notes'
import { inputFile, iterResourceDir, supportedExtensions } from './helpers'

const getInputMock = jest.spyOn(core, 'getInput')
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation(() => {})
const setOutputMock = jest.spyOn(core, 'setOutput')

function mockInputChangelog(path: string, extension: string) {
  getInputMock.mockImplementation(inputName => {
    if (inputName !== 'changelog') {
      fail(`Queried invalid input: ${inputName}`)
    }
    return inputFile(path, extension)
  })
}

function expectedNotes(path: string, extension: string) {
  return readFileSync(`${path}/expected-notes${extension}.txt`).toString()
}

describe('getNotes', () => {
  describe('Valid scenarios', () => {
    iterResourceDir('valid').forEach(scenario => {
      describe(scenario.name, () => {
        const path = `${scenario.path}/${scenario.name}`
        supportedExtensions(path).forEach(extension => {
          it(`should be able to parse ${extension} files`, async () => {
            mockInputChangelog(path, extension)
            await getNotes()
            expect(setOutputMock).toHaveBeenCalledWith('notes', expectedNotes(path, extension))
            expect(setFailedMock).not.toHaveBeenCalled()
          })
        })
      })
    })
  })

  describe('Invalid scenarios', () => {
    iterResourceDir('invalid').forEach(scenario => {
      describe(scenario.name, () => {
        const path = `${scenario.path}/${scenario.name}`
        supportedExtensions(path).forEach(extension => {
          it(`should fail for ${extension} files`, async () => {
            mockInputChangelog(path, extension)
            await getNotes()
            expect(setFailedMock).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
