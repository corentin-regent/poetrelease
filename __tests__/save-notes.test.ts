import { readFileSync } from 'fs'
import * as core from '@actions/core'
import saveNotes from '../src/actions/save-notes'
import { inputFile, iterResourceDir, supportedExtensions } from './helpers'

const getInputMock = jest.spyOn(core, 'getInput')
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation(() => {})

function mockInputs(path: string, extension: string) {
  getInputMock.mockImplementation(inputName => {
    if (inputName === 'changelog') {
      return inputFile(path, extension)
    }
    if (inputName === 'notes-file') {
      return outputNotesPath(path, extension)
    }
    fail(`Queried invalid input: ${inputName}`)
  })
}

function outputNotesPath(path: string, extension: string) {
  return `${path}/expected-notes${extension}.txt`
}

function expectedNotes(path: string, extension: string) {
  return readFileSync(`${path}/expected-notes${extension}.txt`).toString()
}

function outputNotes(path: string, extension: string) {
  return readFileSync(outputNotesPath(path, extension)).toString()
}

describe('saveNotes', () => {
  describe('Valid scenarios', () => {
    iterResourceDir('valid').forEach(scenario => {
      describe(scenario.name, () => {
        const path = `${scenario.path}/${scenario.name}`
        supportedExtensions(path).forEach(extension => {
          it(`should be able to parse ${extension} files`, async () => {
            mockInputs(path, extension)
            await saveNotes()
            expect(outputNotes(path, extension)).toEqual(expectedNotes(path, extension))
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
            mockInputs(path, extension)
            await saveNotes()
            expect(setFailedMock).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
