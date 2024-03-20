import MdHandler from './md'
import RstHandler from './rst'

export const handlers = {
  '.md': MdHandler,
  '.rst': RstHandler
}

export function mkHandler(filename: string) {
  for (const [extension, Handler] of Object.entries(handlers)) {
    if (filename.endsWith(extension)) {
      return new Handler(filename)
    }
  }
  throw new Error(`Unsupported file extension for ${filename}`)
}
