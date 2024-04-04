import BaseHandler from './base'

/**
 * Handler for Markdown Changelogs
 */
export default class MdHandler extends BaseHandler {
  private headings: number

  protected override isUnreleasedSectionHeading(line: string, _: number) {
    if (/^#+(\s+)?Unreleased$/i.test(line)) {
      this.headings = countHeadings(line)
      return true
    }
    return false
  }

  protected override isNextSection(line: string, _: number) {
    return 0 < countHeadings(line) && countHeadings(line) <= this.headings
  }

  protected override extractVersion(trimmedLine: string): string {
    return trimmedLine.replace(/#?\s?/g, '')
  }

  protected override mkHeader(version: string) {
    return `${'#'.repeat(this.headings)} ${version}`
  }
}

function countHeadings(line: string) {
  return /^#+\s/.test(line) ? /^#+/.exec(line)![0].length : 0
}
