import BaseHandler from './base'

/**
 * Handler for reStructuredText Changelogs
 */
export default class RstHandler extends BaseHandler {
  private sectionDelimiter: string

  protected override isUnreleasedSectionHeading(line: string, index: number) {
    if (/^.+$/.test(line)) {
      const previousLine = this.lines[index - 1] ?? ''
      if (/^Unreleased$/i.test(previousLine.trim())) {
        this.sectionDelimiter = line[0]
        return true
      }
    }
    return false
  }

  protected override isNextSection(_: string, index: number) {
    const nextLine = this.lines[index + this.unreleasedSectionStart + 1]
    return !!nextLine?.match(`^\\${this.sectionDelimiter}+$`) // NOSONAR
  }

  protected override extractVersion(trimmedLine: string): string {
    return trimmedLine
  }

  protected override mkHeader(version: string): string {
    return [version, this.sectionDelimiter.repeat(version.length)].join('\n')
  }
}
