import { cpSync, existsSync, readdirSync, rmSync } from 'fs'
import { jest } from '@jest/globals'
import * as core from '@actions/core'
import { handlers } from '../src/handlers'

const resourceRootDir = '__tests__/resources'

const resourceDirs = readdirSync(resourceRootDir, { withFileTypes: true })

const supportedExtensions = Object.keys(handlers)

export function inputFile(path: string, extension: string) {
  return `${path}/input${extension}`
}

export async function test(
  action: () => void | Promise<void>,
  expectedFile: (path: string, extension: string) => string,
  assertWorks: (
    path: string,
    extension: string,
    setOutputMock: jest.SpiedFunction<typeof core.setOutput>
  ) => void,
  mockedInputs: (path: string, extension: string) => Record<string, string> = () => ({}),
  shouldFailIfNoExpectedFile: boolean = true
) {
  const getInputMock = jest.spyOn(core, 'getInput')
  const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation(() => {})
  const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation(() => {})

  function mockInputs(path: string, extension: string) {
    getInputMock.mockImplementation(inputName => {
      const mocked = mockedInputs(path, extension)
      if (inputName in mocked) {
        return mocked[inputName]
      }
      if (inputName === 'changelog') {
        return inputFile(path, extension)
      }
      fail(`Queried invalid input: ${inputName}`)
    })
  }

  describe(action.name, () => {
    const tmpDir = '.tmp_test_resources'
    beforeAll(() => cpSync(resourceRootDir, tmpDir, { recursive: true }))
    afterAll(() => {
      cpSync(tmpDir, resourceRootDir, { recursive: true })
      rmSync(tmpDir, { recursive: true })
    })

    resourceDirs.forEach(scenario => {
      describe(scenario.name, () => {
        const path = `${scenario.path}/${scenario.name}`
        supportedExtensions.forEach(extension => {
          if (existsSync(expectedFile(path, extension))) {
            it(`should work for ${extension} files`, async () => {
              mockInputs(path, extension)
              await action()
              assertWorks(path, extension, setOutputMock)
              expect(setFailedMock).not.toHaveBeenCalled()
            })
          } else if (shouldFailIfNoExpectedFile) {
            it(`should not work for ${extension} files`, async () => {
              mockInputs(path, extension)
              await action()
              expect(setFailedMock).toHaveBeenCalled()
            })
          }
        })
      })
    })
  })
}
