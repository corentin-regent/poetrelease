import { getInput, setFailed, setOutput } from '@actions/core'
import { mkHandler } from '../handlers'

export default async function getNotes() {
  try {
    const changelog = getInput('changelog', { required: true })
    const handler = mkHandler(changelog)
    setOutput('notes', handler.getNotes())
  } catch (error) {
    setFailed(error.message)
  }
}
