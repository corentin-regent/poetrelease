import { readFileSync } from 'fs'
import saveNotes from '../src/actions/save-notes'
import { test } from './helpers'

function expectedFile(path: string, extension: string) {
  return `${path}/expected-notes${extension}.txt`
}

function outputFile(path: string, extension: string) {
  return `${path}/output-notes${extension}.txt`
}

function assertWorks(path: string, extension: string) {
  const expectedNotes = readFileSync(expectedFile(path, extension)).toString()
  const outputNotes = readFileSync(outputFile(path, extension)).toString()
  expect(outputNotes).toEqual(expectedNotes)
}

function mockedInputs(path: string, extension: string) {
  return {
    'notes-file': outputFile(path, extension)
  }
}

test(saveNotes, expectedFile, assertWorks, mockedInputs)
