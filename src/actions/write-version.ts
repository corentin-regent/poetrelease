import { getInput, setFailed } from '@actions/core'
import { mkHandler } from '../handlers'

export default async function writeVersion() {
  try {
    const changelog = getInput('changelog', { required: true })
    const version = getInput('version', { required: true })
    const handler = mkHandler(changelog)
    handler.writeVersion(version)
  } catch (error) {
    setFailed(error.message)
  }
}
