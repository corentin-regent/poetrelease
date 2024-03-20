import { readFileSync, writeFileSync } from 'fs'

/**
 * Base class for Changelog handlers
 */
export default abstract class Handler {
  protected readonly lines: string[]
  protected readonly unreleasedSectionStart: number

  constructor(protected readonly filename: string) {
    this.lines = readFileSync(this.filename).toString().split('\n')
    this.unreleasedSectionStart = this.getUnreleasedSectionStart()
  }

  private getUnreleasedSectionStart() {
    for (const [index, trimmed] of this.iterLines()) {
      if (this.isUnreleasedSectionHeading(trimmed, index)) {
        return index + 1
      }
    }
    throw new Error(`No 'Unreleased' section found in ${this.filename}`)
  }

  public getNotes() {
    const notesBuffer: string[] = []
    for (const [index, line] of this.iterLines(this.unreleasedSectionStart)) {
      if (this.isNextSection(line, index)) {
        break
      }
      notesBuffer.push(line)
    }
    return this.mkNotes(notesBuffer)
  }

  public writeVersion(version: string) {
    this.lines.splice(this.unreleasedSectionStart, 0, '', this.mkHeader(version))
    writeFileSync(this.filename, this.lines.join('\n'))
  }

  private *iterLines(startIndex?: number) {
    for (const [index, line] of this.lines.slice(startIndex).entries()) {
      yield [index, line.trim()] as const
    }
  }

  private mkNotes(buffer: string[]) {
    const result = buffer.join('\n').trim()
    if (result.length) {
      return result
    } else {
      throw new Error(`No unreleased changes found in ${this.filename}`)
    }
  }

  protected abstract isUnreleasedSectionHeading(trimmedLine: string, index: number): boolean

  protected abstract isNextSection(trimmedLine: string, index: number): boolean

  protected abstract mkHeader(version: string): string
}
