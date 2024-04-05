import { getInput, setFailed, setOutput } from '@actions/core'
import { mkHandler } from '../handlers'

export default function getVersion() {
  try {
    const changelog = getInput('changelog', { required: true })
    const handler = mkHandler(changelog)
    const version = handler.getVersion()
    setOutput('version', version)
  } catch (error) {
    setFailed(error.message)
  }
}
