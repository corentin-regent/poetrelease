import { writeFileSync } from 'fs'
import { getInput, setFailed } from '@actions/core'
import { mkHandler } from '../handlers'

export default async function saveNotes() {
  try {
    const changelog = getInput('changelog', { required: true })
    const notesFile = getInput('notes-file', { required: true })
    const handler = mkHandler(changelog)
    const notes = handler.getNotes()
    writeFileSync(notesFile, notes)
  } catch (error) {
    setFailed(error.message)
  }
}
